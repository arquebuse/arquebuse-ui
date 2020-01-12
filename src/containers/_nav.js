export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavItem',
        name: 'Dashboard',
        to: '/dashboard',
        icon: 'cil-speedometer',
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Logout',
        to: '/logout',
        icon: 'cil-account-logout'
      },
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