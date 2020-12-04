import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { RIGHT_ARROW } from '@angular/cdk/keycodes';
import { Observable, of } from 'rxjs';

import {
    ApprovalDataSource,
    ApprovalNode,
    ApprovalProcess,
    PlatformApprovalFlowModule,
    ApprovalFlowComponent,
    User
} from '@fundamental-ngx/platform';
import { createKeyboardEvent } from '../../testing/event-objects';

const users: User[] = [
    {
        id: 'uid38141',
        name: 'Emma Cole',
        description: 'Marketing team',
        imgUrl: 'https://randomuser.me/api/portraits/women/91.jpg'
    },
    {
        id: 'uid37866',
        name: 'Daniel Sullivan',
        description: 'Marketing team',
        imgUrl: 'https://randomuser.me/api/portraits/men/9.jpg'
    },
    {
        id: 'uid28141',
        name: 'Luis Franklin',
        description: 'Legal team',
        imgUrl: 'https://randomuser.me/api/portraits/men/91.jpg'
    },
    {
        id: 'uid08141',
        name: 'Renee Miles',
        description: 'Legal team',
        imgUrl: 'https://randomuser.me/api/portraits/women/11.jpg'
    },
    {
        id: 'uid09141',
        name: 'Salvador Duncan',
        description: 'Marketing team',
        imgUrl: 'https://randomuser.me/api/portraits/men/14.jpg'
    },
    {
        id: 'uid09641',
        name: 'Caleb Taylor',
        description: 'Marketing team',
        imgUrl: 'https://randomuser.me/api/portraits/men/17.jpg'
    },
    {
        id: 'uid99641',
        name: 'Elaine Myers',
        description: 'Legal team',
        imgUrl: 'https://randomuser.me/api/portraits/women/75.jpg'
    },
    {
        id: 'uid99651',
        name: 'Julie Peters',
        description: 'Marketing team',
        imgUrl: 'https://randomuser.me/api/portraits/women/77.jpg'
    },
    {
        id: 'uid99655',
        name: 'Fred Gibson',
        description: 'Marketing team',
        imgUrl: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    {
        id: 'uid81355',
        name: 'George Carter',
        description: 'Marketing team',
        imgUrl: 'https://randomuser.me/api/portraits/men/85.jpg'
    },
    {
        id: 'uid81353',
        name: 'Lillian Walker',
        description: 'Marketing team',
        imgUrl: 'https://randomuser.me/api/portraits/women/25.jpg'
    },
    {
        id: 'uid81955',
        name: 'Josephine Carlson',
        description: 'Sales team',
        imgUrl: 'https://randomuser.me/api/portraits/women/88.jpg'
    },
    {
        id: 'uid77135',
        name: 'Tristan Sutton',
        description: 'Sales team',
        imgUrl: 'https://randomuser.me/api/portraits/men/5.jpg'
    },
    {
        id: 'uid77115',
        name: 'Alvin Stephens',
        description: 'Sales team',
        imgUrl: 'https://randomuser.me/api/portraits/men/78.jpg'
    },
    {
        id: 'uid77111',
        name: 'Logan Herrera',
        description: 'Sales team',
        imgUrl: 'https://randomuser.me/api/portraits/men/53.jpg'
    },
    {
        id: 'uid66141',
        name: 'Melissa Martin',
        description: 'Accounting team',
        imgUrl: 'https://randomuser.me/api/portraits/women/87.jpg'
    },
    {
        id: 'uid66151',
        name: 'Sofia Hanson',
        description: 'Accounting team',
        imgUrl: 'https://randomuser.me/api/portraits/women/24.jpg'
    },
    {
        id: 'uid66161',
        name: 'Jill Fuller',
        description: 'Accounting team',
        imgUrl: 'https://randomuser.me/api/portraits/women/64.jpg'
    },
    {
        id: 'uid66171',
        name: 'Ella Franklin',
        description: 'Accounting team',
        imgUrl: 'https://randomuser.me/api/portraits/women/55.jpg'
    }
];

const simpleGraph: ApprovalProcess = {
    watchers: [getRandomUser(), getRandomUser(), getRandomUser()],
    nodes: [
        {
            id: 'ID1',
            name: 'node name',
            description: 'node description',
            approvers: [getRandomUser()],
            status: 'approved',
            targets: ['ID2'],
            dueDate: new Date(),
            createDate: new Date()
        },
        {
            id: 'ID2',
            name: 'node name',
            description: 'node description',
            approvers: [getRandomUser()],
            status: 'in progress',
            targets: ['ID3'],
            dueDate: new Date(),
            createDate: new Date()
        },
        {
            id: 'ID3',
            name: 'node name',
            description: 'node description',
            approvers: [getRandomUser()],
            status: 'in progress',
            targets: ['ID4'],
            dueDate: new Date(),
            createDate: new Date()
        },
        {
            id: 'ID4',
            name: 'node name',
            description: 'node description',
            approvers: [getRandomUser()],
            status: 'not started',
            targets: [],
            dueDate: new Date(),
            createDate: new Date()
        }
    ]
};

function getRandomUser(): User {
    return users[Math.floor(Math.random() * users.length)];
}

export class TestApprovalFlowDataSource implements ApprovalDataSource {
    fetch(): Observable<ApprovalProcess> {
        return of(simpleGraph);
    }
    fetchUser(id: string): Observable<any> {
        const user = users.find(u => u.id === id);

        return of({
            phone: Math.random().toFixed(13).toString().replace('0.', ''),
            email: `${user.name.toLowerCase().split(' ').join('.')}@company.com`
        });
    }
    updateWatchers(watchers: User[]): void {}
    updateApproval(approval: ApprovalNode): void {}
    updateApprovals(approvals: ApprovalNode[]): void {}
    sendReminders(members: User[], approval: ApprovalNode): void {}
}

const TEST_APPROVAL_FLOW_TITLE = 'Test title';

@Component({
    selector: 'fdp-test-approval-flow',
    template: `
        <fdp-approval-flow [title]="title" [dataSource]="dataSource"></fdp-approval-flow>`
})
class TestPlatformApprovalFlowComponent {
    @ViewChild(ApprovalFlowComponent, { static: true }) component: ApprovalFlowComponent;

    title = TEST_APPROVAL_FLOW_TITLE;

    dataSource = new TestApprovalFlowDataSource();

    constructor() {
    }
}

fdescribe('ApprovalFlowComponent', () => {
    let fixture: ComponentFixture<TestPlatformApprovalFlowComponent>;
    let component: ApprovalFlowComponent;
    let host: TestPlatformApprovalFlowComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PlatformApprovalFlowModule],
            declarations: [ApprovalFlowComponent, TestPlatformApprovalFlowComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestPlatformApprovalFlowComponent);
        host = fixture.componentInstance;
        component = host.component;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render approval flow title', () => {
        const titleEl = fixture.nativeElement.querySelector('.approval-flow-title');
        expect(titleEl).toBeTruthy();
        expect(titleEl.textContent).toEqual(TEST_APPROVAL_FLOW_TITLE);
        const newTitle = `${TEST_APPROVAL_FLOW_TITLE}-changed`;
        host.title = newTitle;
        fixture.detectChanges();
        expect(titleEl.textContent).toEqual(newTitle);
    });

    it('should render watchers list', () => {
        const watchersContainer = fixture.nativeElement.querySelector('.approval-flow-watchers');
        expect(watchersContainer).toBeTruthy();
        expect(watchersContainer.querySelectorAll('fd-avatar').length).toEqual(simpleGraph.watchers.length);
    });

    it('should call watcher click handler on watcher click', () => {
        spyOn(component, 'onWatcherClick');
        const watchersContainer = fixture.nativeElement.querySelector('.approval-flow-watchers');
        const watcher = watchersContainer.querySelector('fd-avatar');
        expect(watcher).toBeTruthy();
        watcher.click();
        expect(component.onWatcherClick).toHaveBeenCalled();
    });

    it('should render nodes', () => {
        const nodesContainer = fixture.nativeElement.querySelector('.approval-flow-graph');
        expect(nodesContainer).toBeTruthy();
        expect(nodesContainer.querySelectorAll('fdp-approval-flow-node').length).toEqual(simpleGraph.nodes.length);
    });

    it('should call node click handler on node click', () => {
        spyOn(component, 'onNodeClick');
        component.nodeComponents.first.onNodeClick.emit();
        expect(component.onNodeClick).toHaveBeenCalled();
    });

    it('should send reminders', () => {
        spyOn(component.dataSource, 'sendReminders');
        component.sendReminders(simpleGraph.nodes[0].approvers, simpleGraph.nodes[0]);
        expect(component.dataSource.sendReminders).toHaveBeenCalled();
    });

    it('should call keydown handler if arrow key was pressed', () => {
        spyOn(component, 'onNodeKeyDown');
        const nodesContainer = fixture.nativeElement.querySelector('.approval-flow-graph');
        expect(nodesContainer).toBeTruthy();
        const nodes = nodesContainer.querySelectorAll('fdp-approval-flow-node');
        const firstNode = nodes[0];
        firstNode.focus();
        expect(document.activeElement).toBe(firstNode);
        const keyboardEvent = createKeyboardEvent('keydown', RIGHT_ARROW, 'ArrowRight');
        firstNode.dispatchEvent(keyboardEvent);
        expect(component.onNodeKeyDown).toHaveBeenCalled();
    });
});
