import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type {
  UserAccount,
  CreateUserAccountData,
  UpdateUserAccountData,
} from "../services/userAccountService";
import { userAccountService } from "../services/userAccountService";
import { type Auditor, auditorService } from "../services/auditorService";

interface UserAccountModalProps {
  userAccount: UserAccount | null;
  onSave: (
    data: CreateUserAccountData | UpdateUserAccountData
  ) => Promise<void>;
  onClose: () => void;
  onDelete?: (id: number) => Promise<void>;
}

function UserAccountModal({
  userAccount,
  onSave,
  onClose,
  onDelete,
}: UserAccountModalProps) {
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    auditorId: 0,
    level: 1,
    email: "",
    password: "",
    confirmPassword: "",
    active: 1,
  });
  const [auditors, setAuditors] = useState<Auditor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [auditorsLoading, setAuditorsLoading] = useState(false);

  const currentUser = userAccountService.getCurrentUser();
  const isSystemAdmin = Number(currentUser?.usr_level) === 1;

  useEffect(() => {
    loadAuditors();
  }, []);

  useEffect(() => {
    if (userAccount) {
      setFormData({
        id: userAccount.id,
        name: userAccount.name,
        auditorId: userAccount.auditorId,
        level: userAccount.level,
        email: userAccount.email,
        password: "",
        confirmPassword: "",
        active: userAccount.active ? 1 : 0,
      });
      setIsActive(userAccount.active);
    } else {
      setFormData({
        id: 0,
        name: "",
        auditorId: 0,
        level: 1,
        email: "",
        password: "",
        confirmPassword: "",
        active: 1,
      });
      setIsActive(true);
    }
    setPasswordEnabled(false);
  }, [userAccount]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      active: isActive ? 1 : 0,
    }));
  }, [isActive]);

  // Helper function to get full name
  const getFullName = (auditor: Auditor) => {
    const parts = [
      auditor.namePrefix,
      auditor.firstName,
      auditor.middleName,
      auditor.lastName,
      auditor.nameSuffix,
    ].filter(Boolean);
    return parts.join(" ");
  };

  const loadAuditors = async () => {
    try {
      setAuditorsLoading(true);
      const data = await auditorService.getAuditors();
      setAuditors(data);
    } catch (err) {
      console.error("Failed to load auditors:", err);
    } finally {
      setAuditorsLoading(false);
    }
  };

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;

    // Length check - more generous scoring
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    if (password.length >= 16) strength += 10;

    // Character variety checks
    if (/[a-z]/.test(password)) strength += 10; // lowercase
    if (/[A-Z]/.test(password)) strength += 15; // uppercase
    if (/[0-9]/.test(password)) strength += 15; // numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 20; // special characters

    return Math.min(strength, 100); // Cap at 100
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData((prev) => ({ ...prev, password }));
    const newStrength = calculatePasswordStrength(password);
    setPasswordStrength(newStrength);
  };

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength <= 25) return "bg-red-400";
    if (strength <= 50) return "bg-yellow-400";
    if (strength <= 75) return "bg-blue-400";
    return "bg-dost-blue";
  };

  const getPasswordStrengthText = (strength: number): string => {
    if (strength <= 25) return "Weak";
    if (strength <= 50) return "Fair";
    if (strength <= 75) return "Good";
    return "Strong";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (formData.password && formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const submitData: any = {};

      if (isSystemAdmin) {
        if (userAccount) {
          // Update existing user account
          submitData.usr_name = formData.name;
          submitData.usr_aur_id = formData.auditorId;
          submitData.usr_level = formData.level;
          submitData.usr_email = formData.email;
          submitData.usr_active = formData.active;
          if (passwordEnabled && formData.password) {
            submitData.usr_password = formData.password;
          }
        } else {
          // Create new user account
          submitData.usr_name = formData.name;
          submitData.usr_aur_id = formData.auditorId;
          submitData.usr_level = formData.level;
          submitData.usr_email = formData.email;
          submitData.usr_password = formData.password;
          submitData.usr_active = formData.active;
        }
      } else {
        // Regular user - only password change
        if (formData.password) {
          submitData.usr_password = formData.password;
        }
      }

      await onSave(submitData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userAccount || !onDelete) return;

    if (
      !window.confirm(`Are you sure you want to delete "${userAccount.name}"?`)
    ) {
      return;
    }

    setLoading(true);
    try {
      await onDelete(userAccount.id);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete user account"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "auditorId" || name === "level" ? parseInt(value) || 0 : value,
    }));
  };

  if (isSystemAdmin) {
    return (
      <div className="fixed inset-0 bg-gray-500/75 bg-opacity-20 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-dost-white z-50">
            <h2 className="text-lg font-bold text-dost-black font-manrope">
              User Account
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-2">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            {/* Active toggle */}
            <div className="flex items-center justify-end mb-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">ACTIVE</span>
                <div
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    isActive ? "bg-dost-blue" : "bg-gray-200"
                  }`}
                  onClick={() => setIsActive(!isActive)}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <select
                  name="auditorId"
                  value={formData.auditorId}
                  onChange={(e) => {
                    handleChange(e);
                    const selectedAuditor = auditors.find(
                      (a) => a.id === parseInt(e.target.value)
                    );
                    if (selectedAuditor) {
                      setFormData((prev) => ({
                        ...prev,
                        name: getFullName(selectedAuditor),
                      }));
                    }
                  }}
                  required
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm cursor-pointer"
                >
                  <option value="">Select Name</option>
                  {auditors.map((auditor) => (
                    <option key={auditor.id} value={auditor.id}>
                      {getFullName(auditor)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Level of Access
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm cursor-pointer"
                >
                  <option value={1}>1 - System Administrator</option>
                  <option value={2}>2 - Director</option>
                  <option value={3}>3 - Division Chief</option>
                  <option value={4}>4 - Supervisor</option>
                  <option value={5}>5 - Internal Auditor</option>
                  <option value={6}>6 - External Auditor</option>
                  <option value={7}>7 - Auditee</option>
                  <option value={8}>8 - Authorized Viewer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email Address (Username)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Password
                </label>
                <div className="flex space-x-2">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    disabled={!passwordEnabled && !!userAccount}
                    required={!userAccount}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm disabled:bg-gray-100"
                  />
                  {userAccount && (
                    <button
                      type="button"
                      onClick={() => setPasswordEnabled(!passwordEnabled)}
                      className="px-4 py-1 bg-dost-blue text-white rounded-md hover:bg-dost-blue-dark transition-colors text-sm cursor-pointer"
                    >
                      {passwordEnabled ? "Cancel" : "Reset"}
                    </button>
                  )}
                </div>
              </div>
              {/* Password strength indicator */}
              {(passwordEnabled || !userAccount) && formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-1">
                      <div
                        className={`h-1 rounded-full transition-all ${getPasswordStrengthColor(
                          passwordStrength
                        )}`}
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                    <span
                      className={`text-xs ${
                        passwordStrength > 75
                          ? "text-dost-blue"
                          : passwordStrength > 50
                          ? "text-blue-400"
                          : passwordStrength > 25
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {getPasswordStrengthText(passwordStrength)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Re-type Password - always show for admin */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Re-type Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={!passwordEnabled && Boolean(userAccount)}
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm disabled:bg-gray-100"
              />
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end items-center pt-2 space-x-4">
              {userAccount ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-6 py-1 text-gray-600 border border-gray-300 rounded-md hover:bg-dost-black hover:text-dost-white transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Delete
                </button>
              ) : (
                <div></div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-1 bg-dost-blue text-white rounded-md hover:bg-dost-blue-dark transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Regular user modal
  const selectedAuditor = auditors.find((a) => a.id === userAccount?.auditorId);

  return (
    <div className="fixed inset-0 bg-gray-500/75 bg-opacity-20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-dost-white z-50">
          <h2 className="text-lg font-bold text-dost-black font-manrope">
            User Account
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          {/* User info */}
          <div className="space-y-2">
            <div className="text-lg font-semibold text-dost-black">
              {userAccount?.name}
            </div>
            <div className="text-sm text-gray-600">
              {auditorsLoading
                ? "Loading position..."
                : selectedAuditor?.position || "Position not available"}
            </div>
          </div>

          {/* Username */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-dost-blue">
              Username:
            </span>
            <span className="text-sm text-dost-black">
              {userAccount?.email}
            </span>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <div className="flex space-x-2">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handlePasswordChange}
                disabled={!passwordEnabled}
                className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm disabled:bg-gray-100"
              />
              <button
                type="button"
                onClick={() => setPasswordEnabled(!passwordEnabled)}
                className="px-4 py-1  text-gray-600 border border-gray-300 rounded-md hover:bg-dost-black hover:text-dost-white transition-colors text-sm cursor-pointer"
              >
                {passwordEnabled ? "Cancel" : "Change"}
              </button>
            </div>
            {/* Password strength indicator - show when password is being changed */}
            {passwordEnabled && formData.password && (
              <div className="mt-2">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full transition-all ${getPasswordStrengthColor(
                        passwordStrength
                      )}`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                  <span
                    className={`text-xs ${
                      passwordStrength > 75
                        ? "text-dost-blue"
                        : passwordStrength > 50
                        ? "text-blue-400"
                        : passwordStrength > 25
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {getPasswordStrengthText(passwordStrength)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Re-type Password - always show for regular users */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Re-type Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={!passwordEnabled}
              className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-dost-blue focus:border-dost-blue outline-none text-sm disabled:bg-gray-100"
            />
          </div>

          {/* Footer button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-1 bg-dost-blue text-white rounded-md hover:bg-dost-blue-dark transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserAccountModal;
