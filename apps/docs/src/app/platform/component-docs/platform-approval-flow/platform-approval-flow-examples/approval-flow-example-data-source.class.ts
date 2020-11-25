import { ApprovalDataSource, ApprovalNode, ApprovalProcess, User } from '@fundamental-ngx/platform';
import { Observable, of } from 'rxjs';

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

function getRandomUser(): User {
    return users[Math.floor(Math.random() * users.length)];
}

const simplestGraph: ApprovalProcess = {
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

const twoNodesGraph: ApprovalProcess = {
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
            targets: [],
            dueDate: new Date(),
            createDate: new Date()
        }
    ]
};

const mediumComplexityGraph: ApprovalProcess = {
    watchers: [getRandomUser(), getRandomUser(), getRandomUser()],
    nodes: [
        {
            id: 'ID1',
            name: 'node name',
            description: 'node description',
            approvers: [getRandomUser()],
            status: 'approved',
            targets: ['ID2', 'ID22', 'ID222'],
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
            id: 'ID22',
            name: 'node name',
            description: 'node description',
            approvers: [getRandomUser()],
            status: 'approved',
            targets: [],
            dueDate: new Date(),
            createDate: new Date()
        },
        {
            id: 'ID222',
            name: 'node name',
            description: 'Marketing team',
            approvers: [getRandomUser(), getRandomUser()],
            status: 'in progress',
            targets: [],
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

const complexGraph: ApprovalProcess = {
    watchers: [getRandomUser(), getRandomUser(), getRandomUser()],
    nodes: [
        {
            id: 'ID1',
            name: 'node name',
            description: 'node description',
            approvers: [getRandomUser()],
            status: 'approved',
            targets: ['ID2', 'ID22', 'ID222'],
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
            id: 'ID22',
            name: 'node name',
            description: 'node description',
            approvers: [getRandomUser()],
            status: 'approved',
            targets: ['ID22-dep'],
            dueDate: new Date(),
            createDate: new Date()
        },
        {
            id: 'ID222',
            name: 'node name',
            description: 'Marketing team',
            approvers: [getRandomUser(), getRandomUser()],
            status: 'in progress',
            targets: ['ID222-dep'],
            dueDate: new Date(),
            createDate: new Date()
        },
        {
            id: 'ID22-dep',
            name: 'node name',
            description: 'node description',
            approvers: [getRandomUser()],
            status: 'approved',
            targets: [],
            dueDate: new Date(),
            createDate: new Date()
        },
        {
            id: 'ID222-dep',
            name: 'node name',
            description: 'Marketing',
            approvers: [getRandomUser()],
            status: 'not started',
            targets: [],
            dueDate: new Date(),
            createDate: new Date()
        },
        {
            id: 'ID3',
            name: 'node name',
            description: 'node description',
            approvers: [getRandomUser()],
            status: 'not started',
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

export class ApprovalFlowExampleDataSource implements ApprovalDataSource {
    /**
     * Fetch of approval process data.
     */
    fetch(): Observable<ApprovalProcess> {
        // return of(twoNodesGraph);
        // return of(simplestGraph);
        return of(mediumComplexityGraph);
        // return of(complexGraph);
    }

    fetchUser(id: string): Observable<any> {
        console.log('fetching user data');
        console.log('passed userId', id);
        const user = users.find(u => u.id === id);

        return of({
            phone: Math.random().toFixed(13).toString().replace('0.', ''),
            email: `${user.name.toLowerCase().split(' ').join('.')}@company.com`
        });
    }

    /**
     * Update watcher list. Called whenever there is a change
     * to the watcher list.
     */
    updateWatchers(watchers: User[]): void {

    }

    /**
     * Update approval details. Called whenever there is a
     * change to the approval detail: change name, change
     * description,, change approvers.
     */
    updateApproval(approval: ApprovalNode): void {

    }

    /**
     * Update approvals. Called whenever there is a change to
     * the approval node graph structure: add node, delete node
     * move node.
     */
    updateApprovals(approvals: ApprovalNode[]): void {

    }

    /**
     * Send reminders for an approval.
     */
    sendReminders(members: User[], approval: ApprovalNode): void {

    }
}
