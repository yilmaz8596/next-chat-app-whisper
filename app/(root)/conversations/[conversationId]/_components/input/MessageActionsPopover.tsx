"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PlusCircle, Smile } from "lucide-react";
import React, { SetStateAction } from "react";
import UploadFileDialog from "../dialogs/UploadFileDialog";
import { File, Image } from "lucide-react";

type Props = {
  setEmojiPickerOpen: (value: SetStateAction<boolean>) => void;
};

const MessageActionsPopover = ({ setEmojiPickerOpen }: Props) => {
  const [uploadFileDialogOpen, setUploadFileDialogOpen] = useState(false);
  const [uploadImageDialogOpen, setUploadImageDialogOpen] = useState(false);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <Button size="icon" variant="secondary">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-2" align="start">
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUploadFileDialogOpen(true)}
          >
            <File className="h-4 w-4 mr-2" />
            Upload File
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUploadImageDialogOpen(true)}
          >
            <Image className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEmojiPickerOpen(true)}
          >
            <Smile className="h-4 w-4 mr-2" />
            Add Emoji
          </Button>
        </div>
      </PopoverContent>

      <UploadFileDialog
        open={uploadFileDialogOpen}
        toggle={setUploadFileDialogOpen}
        type="file"
      />
      <UploadFileDialog
        open={uploadImageDialogOpen}
        toggle={setUploadImageDialogOpen}
        type="image"
      />
    </Popover>
  );
};

export default MessageActionsPopover;
