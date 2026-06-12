"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

const MAX_SIZE_MB = 8; // API(/api/desk/gallery) 제한과 동일

interface ImageDropProps {
  label: string;
  required?: boolean;
  file: File | null;
  onChange: (file: File | null) => void;
  onError: (msg: string) => void;
}

/** 클릭 또는 드래그앤드롭으로 이미지를 고르는 드롭존 — 선택하면 미리보기가 박스를 채움 */
export function ImageDrop({ label, required, file, onChange, onError }: ImageDropProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOver, setIsOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function accept(candidate: File | undefined | null) {
    if (!candidate) return;
    if (!candidate.type.startsWith("image/")) {
      onError("이미지 파일만 올릴 수 있어요.");
      return;
    }
    if (candidate.size > MAX_SIZE_MB * 1024 * 1024) {
      onError(`이미지는 ${MAX_SIZE_MB}MB 이하만 가능해요.`);
      return;
    }
    onError("");
    onChange(candidate);
  }

  function openPicker() {
    inputRef.current?.click();
  }

  return (
    <div
      className={`dropzone${isOver ? " is-over" : ""}${previewUrl ? " has-file" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={`${label} 이미지 선택`}
      onClick={openPicker}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPicker();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        accept(e.dataTransfer.files?.[0]);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          accept(e.target.files?.[0]);
          e.target.value = ""; // 같은 파일을 다시 골라도 onChange가 동작하게
        }}
      />
      {previewUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt={`${label} 미리보기`} className="dropzone-preview" />
          <button
            type="button"
            aria-label={`${label} 제거`}
            className="dropzone-remove"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
          >
            <X size={14} strokeWidth={2} />
          </button>
          <span className="dropzone-name">{file?.name}</span>
        </>
      ) : (
        <div className="dropzone-empty">
          <ImagePlus size={26} strokeWidth={1.5} />
          <b>
            {label} {required ? "(필수)" : "(선택)"}
          </b>
          <span>클릭 또는 사진을 끌어다 놓으세요</span>
        </div>
      )}
    </div>
  );
}
