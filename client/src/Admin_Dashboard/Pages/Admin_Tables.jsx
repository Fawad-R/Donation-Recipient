const TableRow = ({ data }) => (
    <tr className="align-middle">
      <td className="text-nowrap">
        <div className="d-flex align-items-center">
          <Avatar src={data.avatar} size="l" name={data.name} />
          <div className="ms-2">{data.name}</div>
        </div>
      </td>
      <td className="text-nowrap">{data.email}</td>
      <td className="text-nowrap">{data.phone}</td>
      <td className="text-nowrap">{data.address}</td>
      <td>
        <SoftBadge pill bg={data.status.type}>
          {data.status.title}
          <FontAwesomeIcon icon={data.status.icon} className="ms-2" />
        </SoftBadge>
      </td>
      <td className="text-end">$199</td>
    </tr>
  );
  
  const ResponsiveTableExample = () => {
    const customers = [
      {
        name: 'Ricky Antony',
        avatar: team4,
        email: 'ricky@example.com',
        phone: '(201) 200-1851',
        address: '2392 Main Avenue, Penasauka',
        amount: '$99',
        status: { title: 'Completed', type: 'success', icon: 'check' }
      },
      {
        name: 'Emma Watson',
        avatar: team13,
        email: 'emma@example.com',
        phone: '(212) 228-8403',
        address: '2289 5th Avenue, New York',
        status: { title: 'Completed', type: 'success', icon: 'check' }
      },
      {
        name: 'Rowen Atkinson',
        avatar: null,
        email: 'rown@example.com',
        phone: '(201) 200-1851',
        address: '112 Bostwick Avenue, Jersey City',
        amount: '$755',
        status: { title: 'Processing', type: 'primary', icon: 'redo' }
      },
      {
        name: 'Antony Hopkins',
        avatar: team2,
        email: 'antony@example.com',
        phone: '(901) 324-3127',
        address: '3448 Ile De France St #242',
        amount: '$50',
        status: { title: 'On Hold', type: 'secondary', icon: 'ban' }
      },
      {
        name: 'Jennifer Schramm',
        avatar: team3,
        email: 'jennifer@example.com',
        phone: '(828) 382-9631',
        address: '659 Hannah Street, Charlotte',
        amount: '$150',
        status: { title: 'Pending', type: 'warning', icon: 'stream' }
      }
    ];
  
    return (
      <Table responsive striped hover>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Phone</th>
            <th scope="col">Address</th>
            <th scope="col">Status</th>
            <th className="text-end" scope="col">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <TableRow data={customer} key={customer.email}/>
          ))}
        </tbody>
      </Table>
    );
  };
  
  render(<ResponsiveTableExample />)
  