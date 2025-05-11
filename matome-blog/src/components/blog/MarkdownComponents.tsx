import { MDXComponents } from "mdx/types";

export const markdownComponents: MDXComponents = {
  h1: (props) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
  h2: (props) => (
    <h2 className="text-2xl font-bold mt-8 mb-3 border-b pb-1" {...props} />
  ),
  h3: (props) => <h3 className="text-xl font-semibold mt-6 mb-2" {...props} />,
  h4: (props) => <h4 className="text-lg font-semibold mt-4 mb-2" {...props} />,
  h5: (props) => (
    <h5 className="text-base font-semibold mt-3 mb-1" {...props} />
  ),
  pre: (props) => (
    <pre className="bg-muted rounded p-4 overflow-x-auto my-4" {...props} />
  ),
  code: (props) => (
    <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props} />
  ),
  ul: (props) => <ul className="list-disc ml-6 my-2" {...props} />,
  ol: (props) => <ol className="list-decimal ml-6 my-2" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4"
      {...props}
    />
  ),
  a: (props) => (
    <a className="text-primary underline hover:opacity-80" {...props} />
  ),
};
