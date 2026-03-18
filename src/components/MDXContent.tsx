import { MDXRemote } from "next-mdx-remote/rsc";

interface MDXContentProps {
  /** Raw MDX source string (from Supabase DB or local MDX file body) */
  source: string;
}

export async function MDXContent({ source }: MDXContentProps) {
  return <MDXRemote source={source} />;
}
