import { useState, useEffect } from "react";
import {
  userAccountService,
  type UserAccount,
} from "../services/userAccountService";
import Table from "../components/Table";
import UserAccountModal from "../components/UserAccountModal";
import type { TabProps } from "../types/libraryTypes";

const UserAccountTab: React.FC<TabProps> = ({
  searchTerm,
  onDataCount,
  setAddAction,
}) => {
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  const currentUser = userAccountService.getCurrentUser();
  const isSystemAdmin = currentUser?.usr_level === 1;

  useEffect(() => {
    loadUserAccounts();
  }, []);

  useEffect(() => {
    if (setAddAction) {
      if (isSystemAdmin) {
        setAddAction(() => handleAddUser);
      } else {
        // Set a disabled/no-op function for regular users
        setAddAction(() => () => {});
      }
      return () => setAddAction(null);
    }
  }, [setAddAction, isSystemAdmin]);

  const loadUserAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAccountService.getUserAccounts();
      setUserAccounts(data);
      onDataCount(data.length);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load user accounts"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user: UserAccount) => {
    // If not system admin, only allow editing own account
    if (!isSystemAdmin && currentUser?.usr_id !== user.id) {
      setError("You can only edit your own account.");
      return;
    }

    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await userAccountService.deleteUserAccount(id);
      setUserAccounts((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete user account"
      );
    }
  };

  const handleSaveUser = async (userData: any) => {
    try {
      if (editingUser) {
        const updated = await userAccountService.updateUserAccount(
          editingUser.id,
          userData
        );
        setUserAccounts((prev) =>
          prev.map((user) => (user.id === editingUser.id ? updated : user))
        );
      } else {
        const created = await userAccountService.createUserAccount(userData);
        setUserAccounts((prev) => [...prev, created]);
      }
      setShowModal(false);
      setEditingUser(null);
    } catch (err) {
      throw err;
    }
  };

  // Filter data based on search term
  const filteredData = userAccounts.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.agency &&
        user.agency.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userAccountService
        .getLevelName(user.level)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Update data count when filtered data changes
  useEffect(() => {
    onDataCount(filteredData.length);
  }, [filteredData.length, onDataCount]);

  const formatDataForTable = (data: UserAccount[]) => {
    return data.map((user) => ({
      name: (
        <div
          className="cursor-pointer text-dost-black"
          onClick={() => handleEditUser(user)}
        >
          {user.name}
        </div>
      ),
      agency: (
        <div
          className="cursor-pointer text-dost-black"
          onClick={() => handleEditUser(user)}
        >
          {user.agency || "N/A"}
        </div>
      ),
      emailAddress: (
        <div
          className="cursor-pointer text-dost-black"
          onClick={() => handleEditUser(user)}
        >
          {user.email}
        </div>
      ),
      levelOfAccess: (
        <div className="cursor-pointer" onClick={() => handleEditUser(user)}>
          <span className="text-dost-black">
            {!user.active ? (
              <>
                {userAccountService.getLevelName(user.level)}{" "}
                <span className="font-bold">(Inactive)</span>
              </>
            ) : (
              userAccountService.getLevelName(user.level)
            )}
          </span>
        </div>
      ),
      loggedIn: (
        <div
          className="flex items-center justify-center cursor-pointer"
          onClick={() => handleEditUser(user)}
        >
          <div
            className={`w-3 h-3 rounded-full ${
              user.loggedIn === 1 ? "bg-dost-blue" : "border-2 border-gray-400"
            }`}
          ></div>
        </div>
      ),
    }));
  };

  const headers = [
    "Name",
    "Agency",
    "Email Address",
    "Level of Access",
    "Logged In",
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <Table headers={headers} data={formatDataForTable(filteredData)} />

      {showModal && (
        <UserAccountModal
          userAccount={editingUser}
          onSave={handleSaveUser}
          onClose={() => {
            setShowModal(false);
            setEditingUser(null);
          }}
          onDelete={isSystemAdmin ? handleDeleteUser : undefined}
        />
      )}
    </>
  );
};

export default UserAccountTab;
