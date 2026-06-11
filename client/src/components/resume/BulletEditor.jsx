import { cn } from "@/lib/utils";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Trash2 } from "lucide-react";

export function BulletEditor({ bullets, onChange, onDelete }) {
  return (
    <div className="space-y-4">
      {bullets.map((bullet, idx) => (
        <Card key={idx} className="p-4 flex gap-3 items-start relative hover:border-nebula/30 transition-all">
          <div className="w-6 h-6 rounded-full bg-rift flex items-center justify-center font-display font-bold text-xs text-comet shrink-0">
            {idx + 1}
          </div>
          
          <div className="flex-1 space-y-1">
            <textarea
              rows={2}
              value={bullet}
              onChange={(e) => onChange(idx, e.target.value)}
              className="w-full bg-transparent border-0 font-mono text-xs text-stardust focus:outline-none focus:ring-0 resize-y"
              placeholder="Structure your STAR bullet point here..."
            />
            
            <div className="flex items-center justify-between text-[10px] font-semibold text-stardust/40 uppercase tracking-widest pt-1 border-t border-rift">
              <span>STAR metric indicator</span>
              <span className={cn(bullet.length > 200 ? "text-solar font-bold" : "")}>
                {bullet.length} characters
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(idx)}
            className="p-1 hover:bg-supernova/10 text-comet hover:text-supernova transition-all shrink-0 self-start"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </Card>
      ))}
    </div>
  );
}

export default BulletEditor;
