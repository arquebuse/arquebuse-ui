export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavTitle',
        _children: ['Emails']
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Inbound',
        to: '/inbound',
        icon: 'cil-envelope-closed'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Outbound',
        to: '/outbound',
        icon: 'cil-paper-plane'
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Configuration']
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Users',
        to: '/users',
        icon: 'cil-user'
      },
    ]
  }
]