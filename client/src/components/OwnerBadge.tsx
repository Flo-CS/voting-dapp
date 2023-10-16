import { MdPersonOff, MdPerson, MdQuestionMark } from "react-icons/md";

type OwnerBadgeProps = {
  isOwner: "yes" | "no" | "unknown";
};

export default function OwnerBadge({ isOwner }: OwnerBadgeProps) {
  return (
    <>
      <div className="border-gray-700 border border-solid  flex-shrink-0 rounded px-4 py-2 text-xl font-semibold flex items-center">
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
