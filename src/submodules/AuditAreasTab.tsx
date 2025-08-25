import { useState, useEffect } from "react";
import { auditAreaService, type AuditArea } from "../services/auditAreaService";
import TreeNode from "../components/TreeNode";
import AuditAreaModal from "../components/AuditAreaModal";
import type { TabProps } from "../types/libraryTypes";

const AuditAreasTab: React.FC<TabProps> = ({
  searchTerm,
  onDataCount,
  setAddAction,
}) => {
  const [auditAreas, setAuditAreas] = useState<AuditArea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAuditArea, setEditingAuditArea] = useState<AuditArea | null>(
    null
  );

  useEffect(() => {
    loadAuditAreas();
  }, []);

  useEffect(() => {
    if (setAddAction) {
      setAddAction(() => handleAddAuditArea);
      return () => setAddAction(null);
    }
  }, [setAddAction]);

  const loadAuditAreas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await auditAreaService.getAuditAreas();
      setAuditAreas(data);
      onDataCount(data.length);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load audit areas"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddAuditArea = () => {
    setEditingAuditArea(null);
    setShowModal(true);
  };

  const handleEditAuditArea = (auditArea: AuditArea) => {
    setEditingAuditArea(auditArea);
    setShowModal(true);
  };

  const handleDeleteAuditArea = async (id: number) => {
    try {
      await auditAreaService.deleteAuditArea(id);
      setAuditAreas((prev) => prev.filter((area) => area.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete audit area"
      );
    }
  };

  const handleSaveAuditArea = async (auditAreaData: any) => {
    try {
      if (editingAuditArea) {
        const updated = await auditAreaService.updateAuditArea(
          editingAuditArea.id,
          auditAreaData
        );
        setAuditAreas((prev) =>
          prev.map((area) => (area.id === editingAuditArea.id ? updated : area))
        );
      } else {
        const { id, ...dataWithoutId } = auditAreaData;
        const created = await auditAreaService.createAuditArea(dataWithoutId);
        setAuditAreas((prev) => [...prev, created]);
      }
      setShowModal(false);
      setEditingAuditArea(null);
    } catch (err) {
      throw err;
    }
  };

  // Get parent audit areas (those with parentId === null) for the dropdown
  const getParentAuditAreas = (): AuditArea[] => {
    return auditAreas.filter((area) => area.parentId === null);
  };

  // Build tree structure from flat array
  const buildTree = (areas: AuditArea[]): AuditArea[] => {
    const map = new Map<number, AuditArea>();
    const roots: AuditArea[] = [];

    // First pass: create a map of all areas with children arrays
    areas.forEach((area) => {
      map.set(area.id, {
        ...area,
        children: [],
        subAreas: [], // For TreeNode compatibility
        isExpanded: false,
      });
    });

    // Second pass: build the tree structure
    areas.forEach((area) => {
      const node = map.get(area.id)!;
      if (area.parentId === null) {
        roots.push(node);
      } else {
        const parent = map.get(area.parentId);
        if (parent) {
          parent.children!.push(node);
          parent.subAreas!.push(node); // For TreeNode compatibility
        }
      }
    });

    // Calculate entries count for each node
    areas.forEach((area) => {
      const node = map.get(area.id)!;
      // Count all descendants
      const countDescendants = (nodeId: number): number => {
        const children = areas.filter((a) => a.parentId === nodeId);
        return (
          children.length +
          children.reduce((sum, child) => sum + countDescendants(child.id), 0)
        );
      };
      node.entriesCount = countDescendants(area.id);
    });

    return roots;
  };

  // Filter function that searches through the tree
  const filterTree = (areas: AuditArea[], searchTerm: string): AuditArea[] => {
    if (!searchTerm) return areas;

    const filtered: AuditArea[] = [];

    const searchNode = (node: AuditArea): AuditArea | null => {
      const matchesSearch = node.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const filteredChildren: AuditArea[] = [];

      // Check children recursively
      if (node.children) {
        node.children.forEach((child) => {
          const filteredChild = searchNode(child);
          if (filteredChild) {
            filteredChildren.push(filteredChild);
          }
        });
      }

      // If this node matches OR has matching children, include it
      if (matchesSearch || filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren,
          subAreas: filteredChildren, // For TreeNode compatibility
          isExpanded: filteredChildren.length > 0, // Expand if has matching children
        };
      }

      return null;
    };

    areas.forEach((area) => {
      const filteredArea = searchNode(area);
      if (filteredArea) {
        filtered.push(filteredArea);
      }
    });

    return filtered;
  };

  // Count all nodes in the tree (including children)
  const countAllNodes = (areas: AuditArea[]): number => {
    let count = 0;
    const countNode = (node: AuditArea) => {
      count++;
      if (node.children) {
        node.children.forEach(countNode);
      }
    };
    areas.forEach(countNode);
    return count;
  };

  // Build tree structure
  const treeData = buildTree(auditAreas);

  // Filter the tree based on search term
  const filteredTreeData = filterTree(treeData, searchTerm);

  // Update data count when filtered data changes
  useEffect(() => {
    const count = countAllNodes(filteredTreeData);
    onDataCount(count);
  }, [filteredTreeData, onDataCount]);

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

      <div>
        {filteredTreeData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm
              ? "No audit areas found matching your search."
              : "No audit areas found."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-dost-white">
                <tr>
                  <th className="px-4 py-2 text-left text-xs text-dost-blue-dark tracking-wider border-b border-gray border-r border-gray-200 font-manrope font-[700]">
                    Audit Area
                  </th>
                  <th className="px-4 py-2 text-left text-xs text-dost-blue-dark tracking-wider border-b border-gray border-r border-gray-200 font-manrope font-[700]">
                    Sub-Audit Areas
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTreeData.map((area) => (
                  <TreeNode
                    key={area.id}
                    area={area}
                    level={0}
                    onEdit={handleEditAuditArea}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <AuditAreaModal
          auditArea={editingAuditArea}
          parentAuditAreas={getParentAuditAreas()}
          onSave={handleSaveAuditArea}
          onClose={() => {
            setShowModal(false);
            setEditingAuditArea(null);
          }}
          onDelete={handleDeleteAuditArea}
        />
      )}
    </>
  );
};

export default AuditAreasTab;
