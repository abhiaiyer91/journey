import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sub } from "date-fns";
import { useMemo, useState } from "react";
import ReactFlow, { Controls, Background } from "reactflow";
import "reactflow/dist/style.css";

function Flow() {
  const [keyResults, setKeyResults] = useState<any>({});

  const { krNodes: krToNodes, krEdges: edges } = useMemo(() => {
    const krNodes: any = [];
    const krEdges: any = [];
    Object.keys(keyResults ?? {})?.forEach((oItem, i) => {
      krNodes.push({
        id: `${i + 1}`,
        data: { label: keyResults?.[oItem]?.objective },
        position: { x: 0 * 200, y: 0 },
      });
      krEdges.push({
        id: `${i + 1}-${i + 1}.1`,
        source: `${i + 1}`,
        target: `${i + 1}.1`,
        label: "need to",
        type: "step",
      });
      const subKeyResults = keyResults?.[oItem]?.krs || [];
      subKeyResults?.forEach((v, i2) => {
        krNodes.push({
          id: `${i + 1}.${i2 + 1}`,
          data: { label: v },
          position: { x: 0, y: (i2 + 1) * 100 },
        });
        krEdges.push({
          id: `${i + 1}.${i2 + 1}-${i + 1}.${i2 + 2}`,
          source: `${i + 1}.${i2 + 1}`,
          target: `${i + 1}.${i2 + 2}`,
          label: "need to",
          type: "step",
        });
      });
    });
    return { krNodes, krEdges };
  }, [keyResults]);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-2">Vision</h1>
      {!Object.keys(keyResults ?? {})?.length && (
        <div style={{ paddingTop: "20px" }}>
          <Button
            onClick={() => {
              addObjective();
            }}
          >
            Add Objective
          </Button>
        </div>
      )}

      {Object.keys(keyResults ?? {})?.map((objI) => {
        const subKeyResults = keyResults?.[objI]?.["krs"] || [];
        return (
          <div key={objI} className="mb-4 w-[400px]">
            <Label>Objective</Label>
            <Input
              onChange={(e) => changeObjective(objI, e.target.value)}
              value={keyResults?.[objI]?.["objective"]}
            />
            {subKeyResults?.map((item, i) => {
              return (
                <div className="flex" key={i}>
                  <div className="flex-1">
                    <Label>Key Results</Label>
                    <Input
                      onBlur={(e) => changeKeyResult(objI, i, e.target.value)}
                      value={keyResults["krs"]?.[i]}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      removeKeyResult(objI, i);
                    }}
                    className="self-end ml-4"
                  >
                    Remove
                  </Button>
                </div>
              );
            })}
            <div style={{ paddingTop: "20px", textAlign: "center" }}>
              <Button
                onClick={() => {
                  addKeyResult(objI);
                }}
              >
                Add Key Result
              </Button>
            </div>
          </div>
        );
      })}

      <div style={{ height: "600px", width: `100%` }}>
        {krToNodes?.length > 0 && (
          <ReactFlow nodes={krToNodes} edges={edges}>
            <Background />
            <Controls />
          </ReactFlow>
        )}
        {!krToNodes?.length && (
          <div style={{ paddingTop: "30px" }}>
            Add an objective to start seeing your vision flow!
          </div>
        )}
      </div>
    </div>
  );

  function changeObjective(objectIndex, value) {
    setKeyResults({
      ...keyResults,
      [objectIndex]: {
        ...keyResults[objectIndex],
        objective: value,
      },
    });
  }

  // TODO: Change this to allow for multiple objectives
  function addObjective() {
    changeObjective(0, "");
  }

  function addKeyResult(objectIndex) {
    setKeyResults({
      ...keyResults,
      [objectIndex]: {
        ...keyResults[objectIndex],
        krs: [...(keyResults?.[objectIndex]?.krs || []), ""],
      },
    });
  }

  function changeKeyResult(objectIndex, krIndex, value) {
    const currentKeyResults = [...(keyResults?.[objectIndex]?.krs || [])];
    currentKeyResults[krIndex] = value;
    setKeyResults({
      ...keyResults,
      [objectIndex]: {
        ...keyResults[objectIndex],
        krs: currentKeyResults,
      },
    });
  }

  function removeKeyResult(objectIndex, krIndex) {
    const currentKeyResults = [
      ...(keyResults?.[objectIndex]?.krs || []),
    ]?.filter((_, i) => i !== krIndex);
    setKeyResults({
      ...keyResults,
      [objectIndex]: {
        ...keyResults[objectIndex],
        krs: currentKeyResults,
      },
    });
  }
}

export default Flow;
