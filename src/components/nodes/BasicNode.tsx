const BasicNode = ({ data }: { data: { label: string } }) => {
  return (
    <div className="p-2 border border-black bg-white rounded shadow-md">
      <div className="font-bold">{data.label}</div>
    </div>
  );
};

export default BasicNode;