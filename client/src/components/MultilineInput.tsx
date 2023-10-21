import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";

type MultilineInputProps = TextareaAutosizeProps;

export default function MultilineInput({ ...props }: MultilineInputProps) {
  return (
    <>
      <div className="flex overflow-hidden border border-gray-300 border-solid rounded focus-within:border-gray-500">
        <TextareaAutosize
          minRows={5}
          maxRows={10}
          className="w-full px-3 py-2 focus:outline-none"
          {...props}
        />
      </div>
    </>
  );
}
