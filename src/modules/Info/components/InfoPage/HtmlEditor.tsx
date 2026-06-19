"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  Code,
  FileImage,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImageIcon,
  Italic,
  LinkIcon,
  Palette,
  Redo,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

//  pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-color
//  @tiptap/extension-heading @tiptap/extension-highlight @tiptap/extension-image
//  @tiptap/extension-link @tiptap/extension-text-align @tiptap/extension-text-style
//  @tiptap/extension-underline
//
interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  height?: number;
  placeholder?: string;
}

export default function HtmlEditor({
  value,
  onChange,
  label,
  error,
  disabled = false,
  height = 100,
  placeholder = "ابدأ في الكتابة...",
}: HtmlEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => setMounted(true), []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class:
            "text-blue-600 hover:text-blue-800 underline cursor-pointer transition-colors",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto shadow-sm my-4",
        },
      }),
      Color.configure({ types: ["textStyle"] }),
      TextStyle,
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
    ],

    content: value,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose max-w-none focus:outline-none px-4 py-3 min-h-[200px]",
        dir: "rtl",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const applyLink = useCallback(() => {
    if (!editor || !linkUrl) return;

    if (linkText && !editor.state.selection.empty) {
      editor.chain().focus().deleteSelection().insertContent(linkText).run();
    } else if (linkText) {
      editor.chain().focus().insertContent(linkText).run();
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: linkUrl })
      .run();

    setIsLinkDialogOpen(false);
    setLinkUrl("");
    setLinkText("");
  }, [editor, linkUrl, linkText]);

  const applyImageFromUrl = useCallback(() => {
    if (!editor || !imageUrl) return;

    editor
      .chain()
      .focus()
      .setImage({ src: imageUrl, alt: imageAlt || "صورة" })
      .run();

    setIsImageDialogOpen(false);
    setImageUrl("");
    setImageAlt("");
  }, [editor, imageUrl, imageAlt]);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      if (!file.type.startsWith("image/")) {
        alert("الرجاء اختيار ملف صورة صحيح");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("حجم الصورة كبير جداً. الرجاء اختيار صورة أصغر من 5 ميجابايت");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        editor.chain().focus().setImage({ src: base64, alt: file.name }).run();
      };
      reader.readAsDataURL(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [editor],
  );

  const removeLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  if (!mounted || !editor) {
    return (
      <div className="space-y-2">
        {label && <label className="font-medium text-sm">{label}</label>}
        <div
          className="border rounded-lg p-3 animate-pulse bg-gray-50"
          style={{ height: `${height}px` }}
        />
      </div>
    );
  }

  const ToolbarButton = ({
    onClick,
    isActive,
    disabled,
    icon: Icon,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    icon: any;
    title: string;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "h-9 w-9 p-0 hover:bg-gray-100 transition-colors",
        isActive && "bg-blue-50 text-blue-600 hover:bg-blue-100",
      )}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="space-y-3">
      {label && (
        <label className="font-medium text-sm text-gray-700 dark:text-white block">
          {label}
        </label>
      )}

      <div className="  z-10 border rounded-lg shadow-sm">
        <div className="flex flex-wrap items-center gap-1 p-2">
          <div className="flex items-center gap-1 pl-2 border-l">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              icon={Undo}
              title="تراجع (Ctrl+Z)"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              icon={Redo}
              title="إعادة (Ctrl+Y)"
            />
          </div>

          <div className="flex items-center gap-1 px-2 border-x">
            <ToolbarButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              isActive={editor.isActive("heading", { level: 1 })}
              icon={Heading1}
              title="عنوان 1"
            />
            <ToolbarButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              isActive={editor.isActive("heading", { level: 2 })}
              icon={Heading2}
              title="عنوان 2"
            />
            <ToolbarButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              isActive={editor.isActive("heading", { level: 3 })}
              icon={Heading3}
              title="عنوان 3"
            />
          </div>

          <div className="flex items-center gap-1 px-2 border-l">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              icon={Bold}
              title="عريض (Ctrl+B)"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              icon={Italic}
              title="مائل (Ctrl+I)"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
              icon={UnderlineIcon}
              title="تحته خط (Ctrl+U)"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
              icon={Strikethrough}
              title="يتوسطه خط"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive("code")}
              icon={Code}
              title="كود"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              isActive={editor.isActive("highlight")}
              icon={Highlighter}
              title="تظليل"
            />
          </div>

          <div className="flex items-center gap-1 px-2 border-x">
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              isActive={editor.isActive({ textAlign: "right" })}
              icon={AlignRight}
              title="محاذاة لليمين"
            />
            <ToolbarButton
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              isActive={editor.isActive({ textAlign: "center" })}
              icon={AlignCenter}
              title="توسيط"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              isActive={editor.isActive({ textAlign: "left" })}
              icon={AlignLeft}
              title="محاذاة لليسار"
            />
            <ToolbarButton
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              isActive={editor.isActive({ textAlign: "justify" })}
              icon={AlignJustify}
              title="ضبط"
            />
          </div>

          <div className="flex items-center gap-1 px-2 border-x">
            <Popover open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-9 w-9 p-0",
                    editor.isActive("link") && "bg-blue-50 text-blue-600",
                  )}
                  title="إضافة رابط"
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="link-text">النص</Label>
                    <Input
                      id="link-text"
                      placeholder="نص الرابط"
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link-url">الرابط</Label>
                    <Input
                      id="link-url"
                      placeholder="https://example.com"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") applyLink();
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={applyLink}
                      className="flex-1"
                      size="sm"
                    >
                      <Check className="h-4 w-4 ml-2" />
                      إضافة
                    </Button>
                    {editor.isActive("link") && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          removeLink();
                          setIsLinkDialogOpen(false);
                        }}
                        size="sm"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover
              open={isImageDialogOpen}
              onOpenChange={setIsImageDialogOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0"
                  title="إضافة صورة"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>رفع من الجهاز</Label>
                    <div className="flex gap-2">
                      <input
                        placeholder="..."
                        id="n"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label htmlFor="n"></label>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                        size="sm"
                      >
                        <FileImage className="h-4 w-4 ml-2" />
                        اختر صورة
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">أو</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image-url">رابط الصورة</Label>
                    <Input
                      id="image-url"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image-alt">النص البديل</Label>
                    <Input
                      id="image-alt"
                      placeholder="وصف الصورة"
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") applyImageFromUrl();
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={applyImageFromUrl}
                    className="w-full"
                    size="sm"
                    disabled={!imageUrl}
                  >
                    <Check className="h-4 w-4 ml-2" />
                    إضافة الصورة
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0"
                  title="لون النص"
                >
                  <Palette className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3">
                <div className="space-y-2">
                  <Label className="">اختر لون النص</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      onChange={(e) =>
                        editor.chain().focus().setColor(e.target.value).run()
                      }
                      className="w-full h-10 border rounded cursor-pointer"
                      title="اختر لون النص"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => editor.chain().focus().unsetColor().run()}
                      title="إزالة اللون"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "border rounded-lg  transition-all duration-200",
          error
            ? "border-red-500 focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-200"
            : "border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200",
          disabled && "bg-gray-50 cursor-not-allowed opacity-60",
        )}
        style={{ minHeight: `${height}px` }}
      >
        <EditorContent
          editor={editor}
          className="h-full overflow-auto prose-img:cursor-pointer"
        />
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex gap-4">
          <span>
            الكلمات: {editor.getText().split(/\s+/).filter(Boolean).length}
          </span>
          <span>الحروف: {editor.getText().length}</span>
        </div>
        {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
      </div>
    </div>
  );
}
