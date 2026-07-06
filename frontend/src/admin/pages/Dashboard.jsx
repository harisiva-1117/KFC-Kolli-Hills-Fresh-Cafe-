const Dashboard = () => {
  const cards = [
    { title: "Menu Items", value: 0 },
    { title: "Categories", value: 0 },
    { title: "Orders Today", value: 0 },
    { title: "Messages", value: 0 },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-xl shadow p-6"
          >
            <h2 className="text-gray-500">{card.title}</h2>
            <p className="text-4xl font-bold mt-3 text-[#2E1B18]">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Recent Activity
        </h2>

        <p className="text-gray-500">
          No recent activity available.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;