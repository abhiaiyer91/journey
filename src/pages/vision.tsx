import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import ReactFlow, { Controls, Background } from "reactflow";
import "reactflow/dist/style.css";

function Flow() {
  const [keyResults, setKeyResults] = useState<any>({});
  const [subKr, setSubKr] = useState([0]);

  console.log(keyResults);

  const krToNodes = [
    {
      id: `${0 + 1}`,
      data: { label: keyResults.objective },
      position: { x: 0 * 200, y: 0 },
    },
    ...(keyResults?.krs || []).map((v, i) => {
      return {
        id: `${0 + 1}.${i + 1}`,
        data: { label: v },
        position: { x: 0, y: (i + 1) * 100 },
      };
    }),
  ];

  const edges = [
    {
      id: `1-1.1`,
      source: "1",
      target: "1.1",
      label: "need to",
      type: "step",
    },
    ...(keyResults?.krs || []).map((v, i) => {
      return {
        id: `${0 + 1}.${i + 1}-${0 + 1}.${i + 2}`,
        source: `${0 + 1}.${i + 1}`,
        target: `${0 + 1}.${i + 2}`,
        label: "need to",
        type: "step",
      };
    }),
  ];

  console.log(edges);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-2">Vision</h1>

      <div className="mb-4 w-[400px]">
        <Label>Objective</Label>
        <Input
          onChange={(e) =>
            setKeyResults({ ...keyResults, objective: e.target.value })
          }
          value={keyResults["objective"]}
        />
        {subKr?.map((item, i, list) => {
          return (
            <div className="flex" key={i}>
              <div className="flex-1">
                <Label>Key Results</Label>
                <Input
                  onBlur={(e) =>
                    setKeyResults({
                      ...keyResults,
                      krs: [...(keyResults?.krs || []), e.target.value],
                    })
                  }
                  value={keyResults["krs"]?.[i]}
                />
              </div>
              {list.length - 1 === i ? (
                <Button
                  onClick={() => {
                    setSubKr([...subKr, i + 1]);
                  }}
                  className="self-end ml-4"
                >
                  Add
                </Button>
              ) : null}
            </div>
          );
        })}
      </div>
      <div style={{ height: "600px", width: `100%` }}>
        <ReactFlow nodes={krToNodes} edges={edges}>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default Flow;
