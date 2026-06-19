function UsersList({ users }) {
  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <h2 className="text-white font-semibold mb-3">
        In Room ({users.length})
      </h2>
      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.socketId} className="text-gray-300 text-sm">
            {u.username}
          </div>
        ))}
      </div>
    </div>
  )
}

export default UsersList