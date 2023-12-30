import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useEffect, useMemo, useState } from "react";
import ReactFlow, { Controls, Background } from "reactflow";
import "reactflow/dist/style.css";

function Flow({ userConfig }) {
  const [keyResults, setKeyResults] = useState<any>({});

  useEffect(() => {
    async function getVision() {
      const { data, error } = await supabase
        .from("vision")
        .select()
        .eq("user_id", userConfig?.id)
        .single();
      if (error) {
        console.log(error);
      }
      if (data) {
        setKeyResults(data?.objectives);
      }
    }
    getVision();
  }, [userConfig?.id]);

  const { krNodes: krToNodes, krEdges: edges } = useMemo(() => {
    const krNodes: any = [];
    const krEdges: any = [];
    Object.keys(keyResults ?? {})?.forEach((oItem, i) => {
      krNodes.push({
        id: `${i + 1}`,
        data: { label: keyResults?.[oItem]?.objective },
        position: { x: i * 200, y: 0 },
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
          position: { x: i * 200, y: (i2 + 1) * 100 },
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
      <div className="flex">
        <h1 className="text-2xl font-semibold tracking-tight mb-2 pr-4">
          Vision
        </h1>
        {!!krToNodes?.length && (
          <Button
            onClick={() => {
              saveVision();
            }}
          >
            Save Vision
          </Button>
        )}
      </div>
      <div className="flex">
        <div className="flex">
          {Object.keys(keyResults ?? {})?.map((objI) => {
            const subKeyResults = keyResults?.[objI]?.["krs"] || [];
            return (
              <div key={objI} className="mb-4 w-[400px] pr-5">
                <Label>Objective</Label>
                <Input
                  onChange={(e) => changeObjective(objI, e.target.value)}
                  value={keyResults?.[objI]?.["objective"]}
                />
                {subKeyResults?.map((item, i) => {
                  return (
                    <div className="flex" key={i}>
                      <div className="flex-1">
                        <Label>Key Result</Label>
                        <Input
                          onChange={(e) =>
                            changeKeyResult(objI, i, e.target.value)
                          }
                          value={subKeyResults?.[i]}
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
                <div className="pt-2 text-center">
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
        </div>
        <div className="pt-6">
          <Button
            onClick={() => {
              addObjective();
            }}
          >
            Add Objective
          </Button>
        </div>
      </div>

      <div style={{ height: "600px", width: `100%` }}>
        {krToNodes?.length > 0 && (
          <ReactFlow nodes={krToNodes} edges={edges}>
            <Background />
            <Controls />
          </ReactFlow>
        )}
        {!krToNodes?.length && (
          <div className="pt-10">
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
    const currentKeyResults = Object.keys(keyResults ?? {}).length;
    changeObjective(currentKeyResults, "");
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

  async function saveVision() {
    const transaction = await supabase
      .from("vision")
      .select()
      .eq("user_id", userConfig?.id)
      .single();

    if (transaction?.data) {
      await supabase
        .from("vision")
        .update({
          ...transaction?.data,
          user_id: userConfig?.id,
          objectives: keyResults,
        })
        .eq("id", transaction?.data?.id);
    } else {
      await supabase.from("vision").upsert({
        ...transaction?.data,
        user_id: userConfig?.id,
        objectives: keyResults,
      });
    }
  }
}

export default Flow;
