import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnInit,
    Output,
    ViewEncapsulation
} from '@angular/core';
import { DIALOG_REF, DialogRef } from '@fundamental-ngx/core';

import { Observable, of } from 'rxjs';

import { ApprovalDataSource, ApprovalNode, User } from '../public_api';
import { DataProvider, ListDataSource } from '../../../domain';

@Component({
    selector: 'fdp-approval-flow-user-details',
    templateUrl: './approval-flow-user-details.component.html',
    styleUrls: ['./approval-flow-user-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
    // encapsulation: ViewEncapsulation.None
})
export class ApprovalFlowUserDetailsComponent implements OnInit {
    @Input() node: ApprovalNode;

    @Input() approvalFlowDataSource: ApprovalDataSource;

    _isListMode = false;

    _dataSource: ListDataSource<User>;
    _selectedItems: any[] = [];
    _userToShowDetails: User;
    _userToShowDetailsData$: Observable<any>;
    _listItemIdPrefix = 'fdp-afud-';

    constructor(@Inject(DIALOG_REF) public dialogRef: DialogRef, private _cdr: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        console.log('ApprovalFlowUserDetailsComponent init', this);
        this._isListMode = this.dialogRef.data.node?.approvers.length > 1;
        if (this._isListMode) {
            this._dataSource = new ListDataSource<User>(new ListDataProvider(this.dialogRef.data.node?.approvers));
        } else {
            this.setUserToShowDetails(this.dialogRef.data.node?.approvers[0] || this.dialogRef.data.watcher);
        }
    }

    onUserClick(user: User): void {
        this.setUserToShowDetails(user);
    }

    backToListFromDetails(): void {
        this._userToShowDetails = undefined;
    }

    setUserToShowDetails(user: User): void {
        this._userToShowDetails = user;
        this._userToShowDetailsData$ = this.dialogRef.data?.approvalFlowDataSource.fetchUser(user.id);
        // this._cdr.detectChanges();
    }

    itemSelected(event: any): void {
        console.log('(iteSelected)', event);
    }

    sendReminder(): void {
        const reminderTargets = this._isListMode ? this.getUsersFromSelectedItems() : this.dialogRef.data.node.approvers;
        this.dialogRef.close(reminderTargets);
    }

    getUsersFromSelectedItems(): User[] {
        return this._selectedItems.map(item => {
            return this.dialogRef.data.node?.approvers.find(user => user.imgUrl === item.avatarSrc);
        });
    }
}

export class ListDataProvider extends DataProvider<User> {
    data: User[];

    constructor(data: User[]) {
        super();
        this.data = data;
    }

    fetch(params: Map<string, string>): Observable<User[]> {
        return of(this.data);
    }
}
