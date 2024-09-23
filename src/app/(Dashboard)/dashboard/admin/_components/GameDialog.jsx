"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useGameEdit } from "@/store/use-game-edit";

const GameDialog = ({ game }) => {
  const editGame = useGameEdit();

  return (
    <Dialog
      open={editGame.isOpen}
      onClose={editGame.onClose}
      as="div"
      className="relative z-50 "
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-lg bg-Plum/50 backdrop-blur-lg p-6 space-y-4">
          <DialogTitle className="text-lg font-semibold">
            Add / Update Game
          </DialogTitle>

          <div className="flex flex-col gap-2">
            <p>{game.name}</p>
            <p>{game.tagLine}</p>
            <p>{game.description}</p>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default GameDialog;
