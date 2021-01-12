import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnInit,
    Output,
    QueryList,
    TemplateRef,
    ViewChild,
    ViewChildren,
    EventEmitter,
    OnDestroy, Optional, ViewEncapsulation
} from '@angular/core';
import { DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, TAB, UP_ARROW } from '@angular/cdk/keycodes';

import { DialogService, KeyUtil, MessageToastService, RtlService } from '@fundamental-ngx/core';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';

import { ApprovalDataSource, ApprovalNode, ApprovalProcess, ApprovalUser } from './interfaces';
import { ApprovalFlowUserDetailsComponent } from './approval-flow-user-details/approval-flow-user-details.component';
import { ApprovalFlowNodeComponent } from './approval-flow-node/approval-flow-node.component';
import { ApprovalFlowAddNodeComponent } from './approval-flow-add-node/approval-flow-add-node.component';
import { isNodeApproved } from '@fundamental-ngx/platform';

export type ApprovalGraphNode = ApprovalNode & { blank?: boolean; meta?: any };

export interface ApprovalGraphNodeMetadata {
    parent: ApprovalGraphNode;
    isRoot: boolean;
    isLast: boolean;
    parallelStart: boolean;
    parallelEnd: boolean;
    isParallel: boolean;
    columnIndex?: number;
    nodeIndex?: number;
    prevVNode?: ApprovalGraphNode;
    nextVNode?: ApprovalGraphNode;
    prevHNode?: ApprovalGraphNode;
    nextHNode?: ApprovalGraphNode;
}

interface ApprovalGraphColumn {
    nodes: ApprovalGraphNode[];
    index?: number;
    isPartial?: boolean;
    allNodesApproved?: boolean
}

type ApprovalFlowGraph = ApprovalGraphColumn[];

@Component({
    selector: 'fdp-approval-flow',
    templateUrl: './approval-flow.component.html',
    styleUrls: ['./approval-flow.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ApprovalFlowComponent implements OnInit, OnDestroy {
    /** Title which is displayed in the header of the Approval Flow component. */
    @Input() title = 'Approval  process';

    /** Data source for the Approval Flow component. */
    @Input() dataSource: ApprovalDataSource;

    /** A reference to the user details template */
    @Input() userDetailsTemplate: TemplateRef<any>;

    /** Whether the approval flow is editable */
    @Input() isEditAvailable = false;

    /** Event emitted on approval flow node click. */
    @Output() nodeClick = new EventEmitter<ApprovalNode>();

    /** @hidden */
    @ViewChild('graphContainerEl') graphContainerEl: ElementRef;

    /** @hidden */
    @ViewChild('graphEl') graphEl: ElementRef;

    /** @hidden */
    @ViewChild('reminderTemplate') reminderTemplate: TemplateRef<any>;

    /** @hidden */
    @ViewChildren(ApprovalFlowNodeComponent) nodeComponents: QueryList<ApprovalFlowNodeComponent>;

    /** @hidden */
    _approvalProcess: ApprovalProcess;

    /** @hidden */
    _graph: ApprovalFlowGraph;

    /** @hidden */
    _isCarousel = false;

    /** @hidden */
    _carouselScrollX = 0;

    /** @hidden */
    _carouselStep = 0;

    /** @hidden */
    _maxCarouselStep = 0;

    /** @hidden */
    _nodeParentsMap: { [key: string]: ApprovalGraphNode } = {};

    /** @hidden */
    _nodeMetaMap: { [key: string]: ApprovalGraphNodeMetadata } = {};

    /**  @hidden */
    _dir: string;

    /**  @hidden */
    _isEditMode = false;

    /**  @hidden */
    _canAddBefore = false;

    /**  @hidden */
    _canAddAfter = false;

    /**  @hidden */
    _canAddParallel = false;

    /**  @hidden */
    _isRemoveButtonVisible = false;

    /**  @hidden */
    _usersForWatchersList: ApprovalUser[] = [];

    /**  @hidden */
    _selectedWatchers: ApprovalUser[] = [];

    /**  @hidden */
    _messages: { text: string; type: 'success' | 'error' }[] = [];

    private subscriptions = new Subscription();

    /** @hidden */
    constructor(
        private _dialogService: DialogService,
        private _messageToastService: MessageToastService,
        private _cdr: ChangeDetectorRef,
        @Optional() private _rtlService: RtlService
    ) {
    }

    /** @hidden */
    get _isRTL(): boolean {
        return this._dir === 'rtl';
    }

    /** @hidden */
    ngOnInit(): void {
        if (!this.dataSource) {
            return;
        }

        this.subscriptions.add(this.dataSource.fetch().subscribe(approvalProcess => {
            console.log('Got approval process data from DataSource, nodes count', approvalProcess.nodes.length);
            this._approvalProcess = approvalProcess;
            this._nodeParentsMap = {};
            this._nodeMetaMap = {};
            this._graph = this._buildNodeTree(approvalProcess.nodes);
            const graphNodes = this._graph.map(a => a.nodes).reduce((a, b) => a.concat(b));
            const blankLength = graphNodes.filter(n => n.blank).length;
            console.log(
                `graph nodes length ${graphNodes.length}`,
                graphNodes.length !== approvalProcess.nodes.length && !blankLength ? 'ERROR: rendered more nodes than provided' : `${blankLength} blank nodes`
            );
            this._cdr.detectChanges();
            this._resetCarousel();
            this._resetAddButtons();
            this._checkCarouselStatus();
        }));
        this.subscriptions.add(this._rtlService.rtl.subscribe(isRtl => {
            this._dir = isRtl ? 'rtl' : 'ltr';
            this._cdr.detectChanges();
        }));

        this._listenOnResize();
    }

    onNodeClick(node: ApprovalNode): void {
        const dialogRef = this._dialogService.open(ApprovalFlowUserDetailsComponent, {
            data: {
                node: node,
                approvalFlowDataSource: this.dataSource,
                userDetailsTemplate: this.userDetailsTemplate,
                rtl: this._isRTL
            }
        });
        dialogRef.afterClosed.subscribe((reminderTargets) => {
            if (Array.isArray(reminderTargets)) {
                this.sendReminders(reminderTargets, node);
            }
        });
        this.nodeClick.emit(node);
    }

    onNodeCheck(node: ApprovalNode, isChecked: boolean): void {
        console.log('onNodeCheck', node, isChecked);
        const checked = this.nodeComponents.filter(n => n._isSelected);
        const checkedNodesCount = checked.length;
        this._isRemoveButtonVisible = checkedNodesCount > 0;
        // this._canAddBefore = checkedNodesCount === 1;
        const canAdd = checkedNodesCount === 1 && !isNodeApproved(checked[0].node);
        this._canAddAfter = canAdd && !this._nodeMetaMap[node.id]?.nextHNode?.blank;
        this._canAddParallel = canAdd;
        // not approved & !_nodeMetaMap[node.id]?.nextHNode?.blank
    }

    onWatcherClick(watcher: ApprovalUser): void {
        this._dialogService.open(ApprovalFlowUserDetailsComponent, {
            data: {
                watcher: watcher,
                approvalFlowDataSource: this.dataSource,
                userDetailsTemplate: this.userDetailsTemplate,
                rtl: this._isRTL
            }
        });


    }

    sendReminders(targets: ApprovalUser[], node: ApprovalNode): void {
        this.dataSource.sendReminders(targets, node).pipe(take(1)).subscribe(() => {
            this._messageToastService.open(this.reminderTemplate, {
                data: {
                    targets: targets,
                    node: node
                },
                duration: 5000
            });
        });
    }

    nextSlide(stepSize = 1): void {
        this._checkCarouselStatus();
        if (Math.abs(this._carouselScrollX) === this._scrollDiff) {
            return;
        }

        const newOffset = this._carouselScrollX - this._carouselStepSize * stepSize;
        const newCarouselStep = this._carouselStep + stepSize;
        this._carouselScrollX = (Math.abs(newOffset) > this._scrollDiff) ? -this._scrollDiff : newOffset;
        this._carouselStep = newCarouselStep <= this._maxCarouselStep ? newCarouselStep : this._maxCarouselStep;
        this._cdr.detectChanges();
    }

    previousSlide(stepSize = 1): void {
        this._checkCarouselStatus();
        if (this._carouselStep === 0) {
            return;
        }
        if (this._carouselStep === 1) {
            this._carouselScrollX = 0;
        } else {
            this._carouselScrollX += this._carouselStepSize * stepSize;
            this._carouselScrollX = this._carouselScrollX <= 0 ? this._carouselScrollX : 0;
        }
        const newCarouselStep = this._carouselStep - stepSize;
        this._carouselStep = newCarouselStep > 0 ? newCarouselStep : 0;
        this._cdr.detectChanges();
    }

    onNodeKeyDown(
        event: KeyboardEvent,
        node: ApprovalGraphNode,
        nodeIndex: number,
        columnIndex: number,
        firstColumn: boolean,
        firstNode: boolean,
        lastColumn: boolean,
        lastNode: boolean
    ): void {
        if (!KeyUtil.isKeyCode(event, [TAB, UP_ARROW, DOWN_ARROW, RIGHT_ARROW, LEFT_ARROW])) {
            return;
        }

        const isTab = KeyUtil.isKeyCode(event, TAB);
        const isShift = event.shiftKey;

        if (
            isTab &&
            ((isShift && firstNode && firstColumn) ||
                (!isShift && lastColumn && lastNode))
        ) {
            return;
        }

        if (isTab) {
            const nodesSequence = this._graph.reduce((result: ApprovalGraphNode[], col: ApprovalGraphColumn) => {
                return result.concat(col.nodes);
            }, []).filter(n => !n.blank);
            const currentNodeIndex = nodesSequence.findIndex(n => n === node);
            const diff = isShift ? -1 : 1;
            const nextNode = nodesSequence[currentNodeIndex + diff];
            if (currentNodeIndex > -1 && nextNode) {
                event.preventDefault();
                this._focusNode(nextNode, 1);
                return;
            }
        }

        event.preventDefault();
        let nextFocusTarget;

        if (KeyUtil.isKeyCode(event, UP_ARROW) && nodeIndex > 0) {
            nextFocusTarget = this._getNextVerticalNode(nodeIndex, columnIndex, 'up');
        }

        if (KeyUtil.isKeyCode(event, DOWN_ARROW)) {
            nextFocusTarget = this._getNextVerticalNode(nodeIndex, columnIndex, 'down');
        }

        if (KeyUtil.isKeyCode(event, LEFT_ARROW)) {
            nextFocusTarget = this._getNextHorizontalNode(nodeIndex, columnIndex, this._isRTL ? 'right' : 'left');
        }

        if (KeyUtil.isKeyCode(event, RIGHT_ARROW)) {
            nextFocusTarget = this._getNextHorizontalNode(nodeIndex, columnIndex, this._isRTL ? 'left' : 'right');
        }

        if (nextFocusTarget?.nextNode) {
            this._focusNode(nextFocusTarget.nextNode, nextFocusTarget.stepSize);
        }
    }

    _enterEditMode(): void {
        this.dataSource.fetchWatchers().pipe(take(1)).subscribe(users => {
            this._usersForWatchersList = users;
            this._selectedWatchers = [...this._approvalProcess.watchers];
            this._isEditMode = true;
        });
    }

    _checkWatchersUpdates(): void {
        const isChanged =
            this._selectedWatchers.length !== this._approvalProcess.watchers.length ||
            this._selectedWatchers.some(watcher => !this._approvalProcess.watchers.find(_watcher => _watcher === watcher));
        console.log('isChanged', isChanged);
        if (isChanged) {
            console.log('save new watchers', this._selectedWatchers);
            this.dataSource.updateWatchers(this._selectedWatchers);
            this._messages.push({ text: 'Watchers changed', type: 'success' });
            this._cdr.detectChanges();
        }
    }

    _displayUserFn(user: ApprovalUser): string {
        return user.name;
    }

    _onMessageDismiss(index: number): void {
        this._messages.splice(index, 1);
    }

    addNode(source: ApprovalGraphNode, type: 'before' | 'after' | 'parallel'): void {
        const _source = source.blank ? this._nodeMetaMap[source.id].prevHNode : source;
        console.log(`add ${type}`);
        const dialogRef = this._dialogService.open(ApprovalFlowAddNodeComponent, {
            data: {
                node: Object.assign({}, this._blankNode, { blank: false }),
                approvalFlowDataSource: this.dataSource,
                userDetailsTemplate: this.userDetailsTemplate,
                rtl: this._isRTL
            }
        });
        dialogRef.afterClosed.subscribe((newNode: ApprovalGraphNode) => {
            if (newNode) {
                newNode.id = `tempId${(Math.random() * 1000).toFixed()}`;
                newNode.description = `temporary description`;
                if (type === 'after') {
                    // const targetNode = this._approvalProcess.nodes.find(n => _source.targets.includes(n.id));
                    newNode.targets = _source.targets;
                    _source.targets = [newNode.id];
                    console.log('changed prev node', _source);
                    this._updateNode(_source);
                }
                if (type === 'parallel') {
                    // const targetNode = this._approvalProcess.nodes.find(n => _source.targets.includes(n.id));
                    const parent = this._nodeMetaMap[_source.id].parent;
                    newNode.targets = _source.targets;
                    // _source.targets = [newNode.id];
                    parent.targets.push(newNode.id);
                    console.log('changed parent node', parent);
                    this._updateNode(parent);
                }
                console.log('add new node', newNode);
                this._approvalProcess.nodes.push(newNode);
                console.log('saving new graph', this._approvalProcess.nodes);
                this.updateApprovalsInDS(this._approvalProcess.nodes);
            }
        });
    }

    addNodeFromToolbar(type: 'before' | 'after' | 'parallel'): void {
        const node = this.nodeComponents.filter(n => n._isSelected)[0].node;
        this.addNode(node, type);
    }

    editNode(node: ApprovalNode): void {
        console.log(`edit node`, node);
        const dialogRef = this._dialogService.open(ApprovalFlowAddNodeComponent, {
            data: {
                isEdit: true,
                node: Object.assign({}, node),
                approvalFlowDataSource: this.dataSource,
                userDetailsTemplate: this.userDetailsTemplate,
                rtl: this._isRTL
            }
        });
        dialogRef.afterClosed.subscribe((newNode: ApprovalGraphNode) => {
            if (newNode) {
                console.log('updating node', newNode);
                this._updateNode(newNode);
                console.log('saving new graph', this._approvalProcess.nodes);
                this.updateApprovalsInDS(this._approvalProcess.nodes);
            }
        });
    }

    deleteNode(node: ApprovalNode, nodes?: ApprovalNode[]): void {
        const meta = this._nodeMetaMap[node.id];
        console.log('delete', node, this._nodeMetaMap[node.id]);
        let _nodes = nodes;
        if (!_nodes) {
            _nodes = [...this._approvalProcess.nodes];
        }

        const index = _nodes.findIndex(n => n.id === node.id);
        const parent = _nodes.filter(n => n.targets.includes(node.id));
        const targets = _nodes.filter(n => node.targets.includes(n.id));
        // console.log('parent', parent);
        // console.log('children', children);
        _nodes.splice(index, 1);
        parent.forEach(n => {
            let newTargets = n.targets.filter(t => t !== node.id);
            if (meta.isParallel) {
                if (targets.length === 1 && this._nodeMetaMap[targets[0].id].isParallel) {
                    newTargets.push(targets[0].id);
                }
                if (this._nodeMetaMap[meta.parent.id].isParallel) {
                    newTargets = newTargets.concat(targets.map(c => c.id));
                }
            } else {
                newTargets = newTargets.concat(targets.map(c => c.id));
            }
            n.targets = newTargets;
        });
        // console.log('saving new graph', _nodes);
        this.updateApprovalsInDS(_nodes);
    }

    /** @hidden */
    _removeCheckedNodes(): void {
        this.nodeComponents.filter(n => n._isSelected).forEach(n => this.deleteNode(n.node));
    }

    /** @hidden */
    updateApprovalsInDS(nodes: ApprovalNode[]): void {
        this.dataSource.updateApprovals(nodes);
    }

    /** @hidden */
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /** @hidden Listen window resize and distribute cards on column change */
    private _listenOnResize(): void {
        this.subscriptions.add(
            fromEvent(window, 'resize')
                .pipe(debounceTime(60))
                .subscribe(() => {
                    this._resetCarousel();
                    this._checkCarouselStatus();
                })
        );
    }

    /** @hidden */
    private _buildNodeTree(nodes: ApprovalGraphNode[]): ApprovalFlowGraph {
        const graph: ApprovalFlowGraph = [];
        const rootNode = findRootNode(nodes);
        if (!rootNode) {
            return graph;
        }

        graph[0] = { nodes: [rootNode] };
        let index = 1;
        let foundLastStep = false;
        const _nodeMetaMap: { [key: string]: ApprovalGraphNodeMetadata } = {};
        const _parentsMap: any = {};

        // meta 1st run
        nodes.forEach(n => {
            const parents = findParentNode(n, nodes);
            _nodeMetaMap[n.id] = {
                parent: parents[0],
                isRoot: !parents.length,
                isLast: !n.targets.length,
                parallelStart: n.targets.length > 1,
                parallelEnd: parents.length > 1,
                isParallel: nodes.filter(_n => findParentNode(_n, nodes).includes(parents[0])).length > 1
            };
        });
        Object.keys(_nodeMetaMap).forEach(id => {
            const meta = _nodeMetaMap[id];
            meta.isParallel = meta.isParallel || (_nodeMetaMap[meta.parent?.id]?.isParallel && !meta.parallelEnd);
        });
        let _nodes = [...nodes];
        do {
            const columnNodes: ApprovalGraphNode[] = [];
            const previousColumnNodes = graph[index - 1].nodes;
            previousColumnNodes.forEach(node => {
                const _columnNodes = findDependentNodes(node, _nodes);
                _nodes = _nodes.filter(n => !_columnNodes.includes(n));
                _columnNodes.forEach(columnNode => this._nodeParentsMap[columnNode.id] = node);
                columnNodes.push(..._columnNodes);
            });
            foundLastStep = columnNodes.length === 0;
            if (foundLastStep) {
                break;
            }

            const parallelNodes = columnNodes.filter(node => _nodeMetaMap[node.id].isParallel);
            const isMixed = columnNodes.length > 1 && parallelNodes.length && parallelNodes.length !== columnNodes.length;
            if (isMixed && previousColumnNodes.length > 1) {
                const parallelColumn: ApprovalGraphNode[] = [...previousColumnNodes];
                parallelColumn.forEach((node, i) => {
                    if (node.blank) {
                        parallelColumn[i] = this._blankNode;
                        return;
                    }
                    const target = columnNodes.find(n => node.targets.includes(n.id));
                    if (target && !_nodeMetaMap[target.id].isParallel) {
                        if (_nodes.indexOf(target) === -1) {
                            _nodes.push(target);
                        }
                        parallelColumn[i] = this._blankNode;
                    } else {
                        parallelColumn[i] = target;
                    }
                });
                graph[index] = { nodes: parallelColumn, isPartial: true };
            } else {
                graph[index] = { nodes: columnNodes };
            }

            index++;
        } while (!foundLastStep);

        // meta 2nd run
        const blank = graph.map(c => c.nodes).reduce((a, b) => a.concat(b)).filter(n => n.blank);
        nodes.concat(blank).forEach(n => {
            const columnIndex = graph.findIndex(c => c.nodes.includes(n));
            if (columnIndex === -1) {
                console.warn('ERROR: node not found in graph', n);
                return;
            }
            const nodeIndex = graph[columnIndex].nodes.findIndex(_n => _n === n);
            _nodeMetaMap[n.id] = {
                ..._nodeMetaMap[n.id],
                columnIndex: columnIndex,
                nodeIndex: nodeIndex,
                prevVNode: graph[columnIndex].nodes[nodeIndex - 1],
                nextVNode: graph[columnIndex].nodes[nodeIndex + 1],
                prevHNode: graph[columnIndex - 1]?.nodes[nodeIndex],
                nextHNode: graph[columnIndex + 1]?.nodes[nodeIndex]
            };
        });
        this._nodeMetaMap = _nodeMetaMap;
        graph.forEach(col => col.allNodesApproved = col.nodes.every(isNodeApproved));
        console.log('nodes metadata', this._nodeMetaMap);
        console.log('graph to display', graph);

        return graph;
    }

    /** @hidden */
    private _focusNode(node: ApprovalGraphNode, step: number): void {
        const nodeToFocus = this.nodeComponents.find(comp => comp.node === node);
        if (!nodeToFocus) {
            return;
        }

        const nodeRect = nodeToFocus._nativeElement.getBoundingClientRect();
        const graphContainerRect = this.graphContainerEl.nativeElement.getBoundingClientRect();
        const graphVisibilityThreshold = graphContainerRect.width;
        const nodeOffsetFromContainerEdge = this._isRTL ?
            (graphContainerRect.right - nodeRect.right) :
            (nodeRect.left - graphContainerRect.left);

        nodeToFocus._focus();

        if ((nodeOffsetFromContainerEdge + nodeRect.width) > graphVisibilityThreshold) {
            this.nextSlide(step);
            return;
        }

        if (nodeOffsetFromContainerEdge < 0) {
            this.previousSlide(step);
        }
    }

    /** @hidden */
    private _checkCarouselStatus(): void {
        this._isCarousel = this.graphEl.nativeElement.scrollWidth > this.graphEl.nativeElement.clientWidth;
        this._maxCarouselStep = Math.ceil(this._scrollDiff / this._carouselStepSize);
        this._cdr.detectChanges();
    }

    /** @hidden */
    private _resetCarousel(): void {
        this._carouselStep = 0;
        this._carouselScrollX = 0;
    }

    /** @hidden */
    private _resetAddButtons(): void {
        this._canAddAfter = false;
        this._canAddBefore = false;
        this._canAddParallel = false;
    }

    /** @hidden */
    private _getNextHorizontalNode = (_ni: number, _ci: number, direction: 'left' | 'right', stepSize: number = 1) => {
        const indexDiff = (direction === 'right' ? 1 : -1);
        const _column = this._graph[_ci + indexDiff];
        if (!_column) {
            return { nextNode: undefined, stepSize: stepSize };
        }

        const _nextNode = _column.nodes[_ni] || _column.nodes[0];
        if (_nextNode.blank) {
            return this._getNextHorizontalNode(_ni, _ci + indexDiff, direction, stepSize + 1);
        }

        return { nextNode: _nextNode, stepSize: stepSize };
    };

    /** @hidden */
    private _updateNode(node: ApprovalNode): void {
        const nodeIndex = this._approvalProcess.nodes.findIndex(n => n.id === node.id);
        if (nodeIndex > -1) {
            this._approvalProcess.nodes[nodeIndex] = node;
        }
    }

    /** @hidden */
    private _getNextVerticalNode = (_ni: number, _ci: number, direction: 'up' | 'down', stepSize: number = 1) => {
        const indexDiff = (direction === 'down' ? 1 : -1);
        const _column = this._graph[_ci];
        const _nextColumn = this._graph[_ci + 1];
        const _nextNode = _column.nodes[_ni + indexDiff] || _nextColumn?.nodes[_ni + 1];
        if (_nextNode && _nextNode.blank) {
            return this._getNextVerticalNode(_ni, _ci + indexDiff, direction, stepSize + 1);
        }

        return { nextNode: _nextNode, stepSize: stepSize };
    };

    /** @hidden */
    private get _blankNode(): ApprovalGraphNode {
        return {
            id: `blankId${(Math.random() * 1000).toFixed()}`,
            name: '',
            targets: [],
            approvers: [],
            status: 'not started',
            blank: true
        };
    }

    /** @hidden */
    private get _carouselStepSize(): number {
        return this.graphEl.nativeElement.scrollWidth / this.graphEl.nativeElement.children.length;
    }

    /** @hidden */
    private get _scrollDiff(): number {
        return this.graphEl.nativeElement.scrollWidth - this.graphEl.nativeElement.clientWidth;
    }
}

function findRootNode(nodes: ApprovalNode[]): ApprovalNode {
    return nodes.find(node => nodes.every(n => !n.targets.includes(node.id)));
}

function findParentNode(node: ApprovalNode, nodes: ApprovalNode[]): ApprovalNode[] {
    return nodes.filter(_n => _n.targets.includes(node.id));
}

function findDependentNodes(root: ApprovalNode, nodes: ApprovalNode[]): ApprovalNode[] {
    return nodes.filter(node => root.targets.includes(node.id));
}

// function findDependentNodes(rootNodes: ApprovalGraphNode[], nodes: ApprovalNode[]): ApprovalNode[] {
//     const rootNodeTargetIds = rootNodes.reduce((acc: string[], node: ApprovalGraphNode) => acc.concat(node.targets), []);
//     return nodes.filter(node => rootNodeTargetIds.includes(node.id));
// }
