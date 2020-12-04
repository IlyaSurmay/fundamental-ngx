import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    OnChanges,
    OnInit,
    Output
} from '@angular/core';
import { ObjectStatus } from '@fundamental-ngx/core';

import { ApprovalGraphNode } from '../approval-flow.component';
import { ApprovalNode, ApprovalStatus } from '../interfaces';

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

    /** Whether node element has arrow on the left side pointing to the node */
    @Input() renderArrow = false;

    /** Whether node element has carousel start marker. Should be set to 'true' for the first node */
    @Input() renderCarouselStartMarker = false;

    /** Whether node element has carousel end marker. Should be set to 'true' for the last node */
    @Input() renderCarouselEndMarker = false;

    /** Whether node is blank */
    @Input()
    @HostBinding('class.blank')
    blank: boolean;

    /** Whether node element has connection line before the node element */
    @Input()
    @HostBinding('class.line-before')
    renderLineBefore = false;

    /** Whether node element has connection line after the node element */
    @Input()
    @HostBinding('class.line-after')
    renderLineAfter = true;

    /** @hidden */
    @HostBinding('class.approved')
    get _isApproved(): boolean {
        return this.node && isNodeApproved(this.node);
    }

    /** @hidden */
    @HostBinding('class.parent-approved')
    get _isParentApproved(): boolean {
        return this.parent && isNodeApproved(this.parent);
    }

    /** @hidden */
    _objectStatus: ObjectStatus;

    @Output() onNodeClick = new EventEmitter<void>();

    constructor(private elRef: ElementRef, private cd: ChangeDetectorRef) {}

    get nativeElement(): HTMLElement {
        return this.elRef.nativeElement;
    }

    ngOnInit(): void {
        this.checkNodeStatus();
    }

    ngOnChanges(): void {
        this.checkNodeStatus();
    }

    focus(): void {
        this.nativeElement.focus({ preventScroll: true });
    }

    openDialog(): void {
        this.onNodeClick.emit();
    }

    private checkNodeStatus(): void {
        if (!this.node) {
            return;
        }

        this._objectStatus = getNodeStatusClass(this.node.status);
        this.cd.detectChanges();
    }

}

function isNodeApproved(node: ApprovalNode): boolean {
    return node.status === 'approved'
}

function getNodeStatusClass(status: ApprovalStatus): ObjectStatus {
    return NODE_STATUS_CLASS_MAP[status] as ObjectStatus;
}
