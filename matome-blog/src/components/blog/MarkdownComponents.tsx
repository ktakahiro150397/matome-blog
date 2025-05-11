import { MDXComponents } from "mdx/types";

export const markdownComponents: MDXComponents = {
  h1: (props) => (
    <h1
      className="text-4xl font-extrabold mt-12 mb-6 leading-tight tracking-tight md:text-5xl md:mt-16 md:mb-8"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="text-3xl font-bold mt-10 mb-5 border-b border-border pb-2 leading-snug tracking-tight md:text-4xl md:mt-14 md:mb-7"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="text-2xl font-semibold mt-8 mb-4 leading-snug tracking-tight md:text-3xl md:mt-10 md:mb-5"
      {...props}
    />
  ),
  h4: (props) => (
    <h4
      className="text-xl font-semibold mt-6 mb-3 leading-snug tracking-tight md:text-2xl md:mt-8 md:mb-4"
      {...props}
    />
  ),
  h5: (props) => (
    <h5
      className="text-lg font-semibold mt-4 mb-2 leading-snug tracking-tight md:text-xl md:mt-6 md:mb-3"
      {...props}
    />
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
