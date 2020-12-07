import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { DIALOG_REF, DialogRef } from '@fundamental-ngx/core';

import { Observable, of } from 'rxjs';

import { ApprovalDataSource, ApprovalNode, User } from '../public_api';
import { DataProvider, ListDataSource } from '../../../domain';

@Component({
    selector: 'fdp-approval-flow-user-details',
    templateUrl: './approval-flow-user-details.component.html',
    styleUrls: ['./approval-flow-user-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApprovalFlowUserDetailsComponent implements OnInit {
    @Input() node: ApprovalNode;

    @Input() approvalFlowDataSource: ApprovalDataSource;

    _isListMode = false;

    _dataSource: ListDataSource<User>;
    _selectedItems: any[] = [];
    _userToShowDetails: User;
    _userToShowDetailsData$: Observable<any>;

    constructor(@Inject(DIALOG_REF) public dialogRef: DialogRef, private _cdr: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this._isListMode = this.dialogRef.data.node?.approvers.length > 1;
        if (this._isListMode) {
            this.setListItems(this.dialogRef.data.node.approvers);
        } else {
            this.setUserToShowDetails(this.dialogRef.data.watcher || this.dialogRef.data.node?.approvers[0]);
        }
    }

    setListItems(users: User[]): void {
        this._dataSource = new ListDataSource<User>(new ListDataProvider(users));
        this._cdr.detectChanges();
    }

    onUserClick(user: User): void {
        this.setUserToShowDetails(user);
    }

    backToListFromDetails(): void {
        this._userToShowDetails = undefined;
    }

    setUserToShowDetails(user: User): void {
        this._userToShowDetails = user;
        this._userToShowDetailsData$ = this.dialogRef.data.approvalFlowDataSource.fetchUser(user.id);
    }

    sendReminder(): void {
        const reminderTargets = this._isListMode ? this.getUsersFromSelectedItems() : this.dialogRef.data.node.approvers;
        this.dialogRef.close(reminderTargets);
    }

    getUsersFromSelectedItems(): User[] {
        return this._selectedItems.map(item => {
            return this.dialogRef.data.node.approvers.find(user => user.imgUrl === item.avatarSrc);
        });
    }

    onSearchStringChange(searchString: string): void {
        this._selectedItems = [];
        if (!searchString) {
            this.setListItems(this.dialogRef.data.node.approvers);
            return;
        }

        const result = this.dialogRef.data.node.approvers.filter(
            user => user.name.toLowerCase().indexOf(searchString.toLowerCase()) > -1
        );
        this.setListItems(result);
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
