"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { useDominusStore } from "@/lib/store";

type ExecutionState = 'preview' | 'confirm' | 'sign_tx' | 'submit' | 'status';

export default function ExecutionModal() {
  const { executionModalOpen, closeExecutionModal } = useDominusStore();
  const [size, setSize] = useState('');
  const [state, setState] = useState<ExecutionState>('preview');
  const resetModal = () => { setSize(''); setState('preview'); closeExecutionModal(); };

  return <Dialog.Root open={executionModalOpen} onOpenChange={(open) => !open && resetModal()}>
    <AnimatePresence>{executionModalOpen && <Dialog.Portal forceMount><Dialog.Overlay asChild><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[60] bg-black/60"/></Dialog.Overlay>
      <Dialog.Content asChild><motion.div className="fixed left-1/2 top-1/2 z-[70] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 neon-border" style={{background:'#111114'}}>
        <Dialog.Title className="text-xl font-bold mb-2">Execute Trade</Dialog.Title>
        <Dialog.Description className="text-muted text-xs mb-4">Backend-ready flow: preview → confirm → sign tx → submit → status</Dialog.Description>
        <input type="number" value={size} onChange={(e)=>setSize(e.target.value)} placeholder="0.00" className="w-full bg-abyss border border-surface rounded-xl px-4 py-3 text-lg mb-4"/>
        <div className="text-xs text-muted mb-4">Current step: <span className="text-white">{state}</span></div>
        <div className="flex gap-2 flex-wrap">
          <button className="px-3 py-2 bg-surface rounded" onClick={()=>setState('confirm')}>Preview</button>
          <button className="px-3 py-2 bg-surface rounded" onClick={()=>setState('sign_tx')}>Confirm</button>
          <button className="px-3 py-2 bg-surface rounded" onClick={()=>setState('submit')}>Sign Tx</button>
          <button className="px-3 py-2 bg-surface rounded" onClick={()=>setState('status')}>Submit</button>
        </div>
      </motion.div></Dialog.Content></Dialog.Portal>}</AnimatePresence>
  </Dialog.Root>
}
