import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function DBSchema() {
  const [hoveredEntity, setHoveredEntity] = useState(null);

  const entities = [
    {
      id: "User",
      title: "User",
      fields: [
        { name: "id", type: "String (PK)" },
        { name: "email", type: "String (Unique)" },
        { name: "name", type: "String" },
        { name: "passwordHash", type: "String" },
        { name: "createdAt", type: "DateTime" }
      ],
      x: "left-[20px] top-[20px]",
      related: ["Order"]
    },
    {
      id: "Order",
      title: "Order",
      fields: [
        { name: "id", type: "String (PK)" },
        { name: "userId", type: "String (FK)" },
        { name: "status", type: "String" },
        { name: "totalAmount", type: "Int" },
        { name: "createdAt", type: "DateTime" }
      ],
      x: "left-[20px] top-[220px]",
      related: ["User", "OrderItem"]
    },
    {
      id: "OrderItem",
      title: "OrderItem",
      fields: [
        { name: "id", type: "String (PK)" },
        { name: "orderId", type: "String (FK)" },
        { name: "productId", type: "String (FK)" },
        { name: "quantity", type: "Int" },
        { name: "price", type: "Int" }
      ],
      x: "left-[290px] top-[110px]",
      related: ["Order", "Product"]
    },
    {
      id: "Product",
      title: "Product",
      fields: [
        { name: "id", type: "String (PK)" },
        { name: "name", type: "String" },
        { name: "price", type: "Int" },
        { name: "stock", type: "Int" },
        { name: "description", type: "String" }
      ],
      x: "left-[550px] top-[20px]",
      related: ["OrderItem"]
    }
  ];

  const getLineStroke = (e1, e2) => {
    if (!hoveredEntity) return "rgba(30, 30, 58, 0.5)";
    if (hoveredEntity === e1 || hoveredEntity === e2) {
      return "#7c3aed";
    }
    return "rgba(30, 30, 58, 0.2)";
  };

  const isPulsing = (entityId) => {
    if (!hoveredEntity) return false;
    const current = entities.find(e => e.id === hoveredEntity);
    return current?.related.includes(entityId) || hoveredEntity === entityId;
  };

  return (
    <div className="w-full flex items-center justify-center p-6 bg-void/30 border border-rift rounded-xl overflow-x-auto select-none">
      <div className="relative w-[750px] h-[380px]">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 750 380" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#7c3aed" />
            </marker>
          </defs>

          <path
            d="M 100 155 L 100 220"
            stroke={getLineStroke("User", "Order")}
            strokeWidth="2"
            markerEnd={hoveredEntity && (hoveredEntity === "User" || hoveredEntity === "Order") ? "url(#arrow)" : undefined}
          />
          
          <path
            d="M 180 280 C 235 280, 235 200, 290 200"
            stroke={getLineStroke("Order", "OrderItem")}
            strokeWidth="2"
            markerEnd={hoveredEntity && (hoveredEntity === "Order" || hoveredEntity === "OrderItem") ? "url(#arrow)" : undefined}
          />

          <path
            d="M 600 155 C 600 200, 500 200, 440 200"
            stroke={getLineStroke("Product", "OrderItem")}
            strokeWidth="2"
            markerEnd={hoveredEntity && (hoveredEntity === "Product" || hoveredEntity === "OrderItem") ? "url(#arrow)" : undefined}
          />
        </svg>

        {entities.map((ent) => {
          const active = isPulsing(ent.id);
          const isDirect = hoveredEntity === ent.id;

          return (
            <motion.div
              key={ent.id}
              onMouseEnter={() => setHoveredEntity(ent.id)}
              onMouseLeave={() => setHoveredEntity(null)}
              className={cn(
                "absolute w-[180px] rounded-lg border bg-cavern p-3 shadow-lg transition-all",
                isDirect
                  ? "border-nebula shadow-[0_0_20px_rgba(124,58,237,0.25)] scale-102"
                  : active
                  ? "border-aurora/60 shadow-[0_0_12px_rgba(99,102,241,0.15)] animate-pulse"
                  : "border-rift"
              )}
              style={{ top: ent.x.split(" ")[1].split("-")[1].replace("]", ""), left: ent.x.split(" ")[0].split("-")[1].replace("]", "") }}
            >
              <div className="border-b border-rift pb-1.5 mb-2 flex items-center justify-between">
                <span className="text-xs font-display font-bold text-white uppercase tracking-wider">{ent.title}</span>
                <span className="text-[9px] text-stardust/40 font-mono">Model</span>
              </div>
              <div className="space-y-1.5 font-mono text-[10px]">
                {ent.fields.map((f) => (
                  <div key={f.name} className="flex justify-between items-center text-stardust">
                    <span className={cn(f.type.includes("PK") || f.type.includes("FK") ? "text-comet font-semibold" : "")}>{f.name}</span>
                    <span className="text-[9px] text-stardust/40">{f.type}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
