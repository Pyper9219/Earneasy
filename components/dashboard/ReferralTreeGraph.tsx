"use client";

import type { ReferralNode } from "@/types/referral";

export default function ReferralTreeGraph({ root }: { root: ReferralNode }) {
  return (
    <div className="overflow-auto">
      <Node node={root} depth={0} />
    </div>
  );
}

function Node({ node, depth }: { node: ReferralNode; depth: number }) {
  const colors = ["bg-emerald-500", "bg-blue-500", "bg-purple-500", "bg-slate-500"];
  return (
    <div className="ml-4 border-l-2 border-slate-200 pl-4 py-2">
      <div className="flex items-center gap-3">
        <span
          className={`w-3 h-3 rounded-full ${
            colors[Math.min(depth, colors.length - 1)]
          }`}
        />
        <div>
          <p className="font-medium text-sm">{node.name}</p>
          <p className="text-xs text-slate-500">{node.email}</p>
        </div>
      </div>
      {node.children?.map((child) => (
        <Node key={child.userId} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}