import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import ReactFlow, { Controls, Background } from "reactflow";
import "reactflow/dist/style.css";

function Flow() {
  const [keyResults, setKeyResults] = useState<any>({});
  const [objs, setObjs] = useState([0]);
  const [subKr, setSubKr] = useState([0]);

  const krToNodes = objs?.flatMap((oItem, i) => [
    {
      id: `${i + 1}`,
      data: { label: keyResults?.[oItem]?.objective },
      position: { x: 0 * 200, y: 0 },
    },
    ...(keyResults?.[oItem]?.krs || []).map((v, i2) => {
      return {
        id: `${i + 1}.${i2 + 1}`,
        data: { label: v },
        position: { x: 0, y: (i2 + 1) * 100 },
      };
    }),
  ]);

  const edges = objs?.flatMap((oItem) => [
    {
      id: `${oItem + 1}-${oItem + 1}.1`,
      source: `${oItem + 1}`,
      target: `${oItem + 1}.1`,
      label: "need to",
      type: "step",
    },
    ...(keyResults?.[oItem]?.krs || []).map((v, i) => {
      return {
        id: `${oItem + 1}.${i + 1}-${oItem + 1}.${i + 2}`,
        source: `${oItem + 1}.${i + 1}`,
        target: `${oItem + 1}.${i + 2}`,
        label: "need to",
        type: "step",
      };
    }),
  ]);

  console.log(krToNodes, edges);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-2">Vision</h1>

      {objs?.map((objI) => {
        return (
          <div className="mb-4 w-[400px]">
            <Label>Objective</Label>
            <Input
              onChange={(e) =>
                setKeyResults({
                  ...keyResults,
                  [objI]: {
                    ...keyResults[objI],
                    objective: e.target.value,
                  },
                })
              }
              value={keyResults?.[objI]?.["objective"]}
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
                          [objI]: {
                            ...keyResults[objI],
                            krs: [
                              ...(keyResults?.[objI]?.krs || []),
                              e.target.value,
                            ],
                          },
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
        );
      })}

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
