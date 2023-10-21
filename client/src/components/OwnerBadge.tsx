import { MdPersonOff, MdPerson, MdQuestionMark } from "react-icons/md";
import { IsOwner } from "../types/Owner";

type OwnerBadgeProps = {
  isOwner: IsOwner;
};

export default function OwnerBadge({ isOwner }: OwnerBadgeProps) {
  return (
    <>
      <div className="flex items-center flex-shrink-0 px-4 py-2 text-xl font-semibold border border-gray-700 border-solid rounded">
        {isOwner === "yes" && (
          <>
            <MdPerson />
            <span className="ml-3 text-sm">Owner</span>
          </>
        )}
        {isOwner === "no" && (
          <>
            <MdPersonOff />
            <span className="ml-3 text-sm">Not owner</span>
          </>
        )}
        {isOwner === "unknown" && (
          <>
            <MdQuestionMark />
            <span className="ml-3 text-sm">Unknown</span>
          </>
        )}
      </div>
    </>
  );
}
