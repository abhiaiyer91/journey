import { Button } from "@/components/ui/button";
import {
  DialogTrigger,
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { DialogPortal } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ReactFlow, { Controls, Background } from "reactflow";
import "reactflow/dist/style.css";

function Flow({ userConfig }) {
  const [keyResults, setKeyResults] = useState<any>({});
  const [currentObjective, setCurrentObjective] = useState<any>(null);

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
      <h1 className="text-2xl font-semibold tracking-tight mb-2 pr-4">
        Vision
      </h1>
      <ObjectiveDialog
        currentObjective={currentObjective}
        setCurrentObjective={setCurrentObjective}
        keyResults={keyResults}
        setKeyResults={setKeyResults}
        saveVision={saveVision}
      />
      <div className="pt-6 pb-6">
        <Button
          onClick={() => {
            addObjective();
          }}
        >
          Add Objective
        </Button>
      </div>

      <div className="flex">
        {Object.keys(keyResults ?? {})?.map((objI) => {
          const subKeyResults = keyResults?.[objI]?.["krs"] || [];
          return (
            <div
              style={{ cursor: "pointer" }}
              key={objI}
              className="mb-4 w-[200px] mr-5 border-2"
              onClick={() => setCurrentObjective(objI)}
            >
              <div className="flex justify-between">
                <Label>Objective: </Label>
                <div
                  onClick={(event) => {
                    if (event.stopPropagation) event.stopPropagation();
                    deleteObjective(objI);
                  }}
                >
                  <X className="h-4 w-4" />
                </div>
              </div>
              <Label>{keyResults?.[objI]?.["objective"]}</Label>
              {subKeyResults?.map((item, i) => {
                return (
                  <div className="flex" key={i}>
                    <div className="flex-1">
                      <Label>Key Result: </Label>
                      <Label>{subKeyResults?.[i]}</Label>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
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

  function addObjective() {
    const currentKeyResults = Object.keys(keyResults ?? {}).length;
    setCurrentObjective(currentKeyResults);
  }

  async function deleteObjective(objectIndex) {
    delete keyResults[objectIndex];
    setKeyResults({
      ...keyResults,
    });
    await saveVision(keyResults);
  }

  async function saveVision(results) {
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
          objectives: results,
        })
        .eq("id", transaction?.data?.id);
    } else {
      await supabase.from("vision").upsert({
        ...transaction?.data,
        user_id: userConfig?.id,
        objectives: results,
      });
    }
  }
}

function ObjectiveDialog({
  currentObjective,
  setCurrentObjective,
  keyResults,
  setKeyResults,
  saveVision,
}) {
  const [visionObject, setVisionObject] = useState(
    keyResults[currentObjective] ?? {}
  );
  const subKeyResults = visionObject?.["krs"] || [];
  useEffect(() => {
    setVisionObject(keyResults[currentObjective] ?? {});
  }, [currentObjective, keyResults]);

  const open = useMemo(
    () => currentObjective !== null && currentObjective !== undefined,
    [currentObjective]
  );
  return (
    <Dialog open={open} onOpenChange={setCurrentObjective}>
      <DialogPortal>
        <DialogContent>
          <DialogHeader>{`${
            currentObjective ? "Edit" : "Create"
          } Objective`}</DialogHeader>
          <div className="mb-4 w-[400px] pr-5">
            <Label>Objective</Label>
            <Input
              onChange={(e) => changeObjectiveName(e.target.value)}
              value={visionObject?.["objective"] ?? ""}
            />
            {subKeyResults?.map((item, i) => {
              return (
                <div className="flex" key={i}>
                  <div className="flex-1">
                    <Label>Key Result</Label>
                    <Input
                      onChange={(e) => changeKeyResult(i, e.target.value)}
                      value={subKeyResults?.[i] ?? ""}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      removeKeyResult(i);
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
                  addKeyResult();
                }}
              >
                Add Key Result
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                submitObjective();
              }}
            >
              {`${currentObjective ? "Update" : "Submit"} Objective`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );

  function changeObjectiveName(value) {
    setVisionObject({
      ...visionObject,
      objective: value,
    });
  }

  function addKeyResult() {
    setVisionObject({
      ...visionObject,
      krs: [...(visionObject?.krs || []), ""],
    });
  }

  function changeKeyResult(krIndex, value) {
    const currentKeyResults = [...(visionObject?.krs || [])];
    currentKeyResults[krIndex] = value;

    setVisionObject({
      ...visionObject,
      krs: currentKeyResults,
    });
  }

  function removeKeyResult(krIndex) {
    const currentKeyResults = [...(visionObject?.krs || [])]?.filter(
      (_, i) => i !== krIndex
    );

    setVisionObject({
      ...visionObject,
      krs: currentKeyResults,
    });
  }

  async function submitObjective() {
    const currentKeyObjIndex =
      currentObjective ?? Object.keys(keyResults ?? {}).length;
    setKeyResults({
      ...keyResults,
      [currentKeyObjIndex]: visionObject,
    });
    setCurrentObjective(null);
    await saveVision({
      ...keyResults,
      [currentKeyObjIndex]: visionObject,
    });
  }
}


export default Flow;
