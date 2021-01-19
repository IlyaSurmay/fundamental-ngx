import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { ObjectStatus } from '@fundamental-ngx/core';

import { ApprovalGraphNode, ApprovalGraphNodeMetadata } from '../approval-flow.component';
import { ApprovalNode, ApprovalStatus } from '../interfaces';
import { isNodeApproved } from '../helpers';

const NODE_STATUS_CLASS_MAP = {
    'approved': 'positive',
    'rejected': 'negative',
    'in progress': 'informative',
    'not started': ''
};

@Component({
    selector: 'fdp-approval-flow-node',
    templateUrl: './approval-flow-node.component.html',
    styleUrls: ['./approval-flow-node.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'fdp-approval-flow-node'
    }
})
export class ApprovalFlowNodeComponent implements OnInit, OnChanges {
    /** Approval flow graph node */
    @Input() node: ApprovalGraphNode;

    /** A reference to a parent node */
    @Input() parent: ApprovalNode;

    /** Node metadata */
    @Input() meta: ApprovalGraphNodeMetadata;

    /** Whether node element has arrow on the left side pointing to the node */
    @Input() renderArrow = false;

    /** Whether node element has carousel start marker. Should be set to 'true' for the first node */
    @Input() renderCarouselStartMarker = false;

    /** Whether node element has carousel end marker. Should be set to 'true' for the last node */
    @Input() renderCarouselEndMarker = false;

    /** Whether to display add node button before in Edit mode */
    @Input() canAddNodeBefore = false;

    /** Whether to display add node button after in Edit mode */
    @Input() canAddNodeAfter = false;

    /** Whether node is blank */
    @Input()
    @HostBinding('class.approval-flow-node--blank')
    blank: boolean;

    /** Whether the node is in edit mode */
    @Input()
    @HostBinding('class.approval-flow-node--edit-mode')
    isEdit: boolean;

    /** Whether node element has connection line before the node element */
    @Input()
    @HostBinding('class.approval-flow-node--line-before')
    renderLineBefore = false;

    /** Whether node element has connection line after the node element */
    @Input()
    @HostBinding('class.approval-flow-node--line-after')
    renderLineAfter = true;

    /** @hidden */
    @HostBinding('class.approval-flow-node--approved')
    get _isApproved(): boolean {
        return this.node && isNodeApproved(this.node);
    }

    /** @hidden */
    @HostBinding('class.approval-flow-node--parent-approved')
    get _isParentApproved(): boolean {
        if (!this.parent) {
            return true;
        }

        return this.parent && isNodeApproved(this.parent);
    }

    /** @hidden */
    @HostBinding('class.approval-flow-node--selected')
    get _isNodeSelected(): boolean {
        return this.isEdit && this._isSelected;
    }

    /** @hidden */
    @HostBinding('class.approval-flow-node--blank-top')
    get _isBlankTopNode(): boolean {
        return Boolean(this.blank && this.meta?.nextHNode);
    }

    _isDropZoneActive = false;

    /** @hidden */
        // make public input?
    _isSelected = false;

    /** @hidden */
    _objectStatus: ObjectStatus;

    @Output() onNodeClick = new EventEmitter<void>();

    @Output() onNodeCheck = new EventEmitter<boolean>();

    @Output() onAdd = new EventEmitter<string>();

    @Output() onEdit = new EventEmitter<void>();

    @Output() onDelete = new EventEmitter<void>();

    @ViewChild('dropZone') dropZone: ElementRef;

    /** @hidden */
    @HostListener('click')
    _onClick(): void {
        if (this.node.blank) {
            return;
        }
        this.onNodeClick.emit();
    }

    /** @hidden */
    constructor(private elRef: ElementRef, private cd: ChangeDetectorRef) {
    }

    /** @hidden */
    get _nativeElement(): HTMLElement {
        return this.elRef.nativeElement;
    }

    /** @hidden */
    get _isNotStarted(): boolean {
        return this.node.status === 'not started';
    }

    /** @hidden */
    get _isEditActionsAvailable(): boolean {
        return this.node.status === 'approved' || this.node.status === 'rejected';
    }

    /** @hidden */
    ngOnInit(): void {
        this._checkNodeStatus();
    }

    /** @hidden */
    ngOnChanges(): void {
        this._checkNodeStatus();
    }

    /** @hidden */
    _focus(): void {
        this._nativeElement.focus({ preventScroll: true });
    }

    /** @hidden */
    _onCheck(isChecked: boolean): void {
        this.onNodeCheck.emit(isChecked);
    }

    /** @hidden */
    _setDragZoneStatus(status: boolean): void {
        this._isDropZoneActive = status;
        this.cd.detectChanges();
    }

    /** @hidden */
    _checkIfDrragedNodeInDropZone(nodeRect: DOMRect): void {
        const dropZoneRect = this.dropZone.nativeElement.getBoundingClientRect();
        console.log('dropZoneRect', dropZoneRect);
        if (dropZoneRect.top + dropZoneRect.height > nodeRect.top
            && dropZoneRect.left + dropZoneRect.width > nodeRect.left
            && dropZoneRect.bottom - dropZoneRect.height < nodeRect.bottom
            && dropZoneRect.right - dropZoneRect.width < nodeRect.right) {
            this._setDragZoneStatus(true);
            return;
        }
        this._setDragZoneStatus(false);
    }

    /** @hidden */
    private _checkNodeStatus(): void {
        if (!this.node) {
            return;
        }

        this._objectStatus = getNodeStatusClass(this.node.status);
        this.cd.detectChanges();
    }

}

function getNodeStatusClass(status: ApprovalStatus): ObjectStatus {
    return NODE_STATUS_CLASS_MAP[status] as ObjectStatus;
}
