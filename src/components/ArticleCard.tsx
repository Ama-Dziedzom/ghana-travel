import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { type Article } from "contentlayer/generated";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const ArticleCard = ({ article, featured }: ArticleCardProps) => {
  return (
    <Link 
      href={article.url}
      className="group block h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden mb-6 bg-border">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-body text-[10px] uppercase tracking-[0.2em] font-bold text-accent">
            {article.category}
          </span>
          <div className="flex items-center text-muted space-x-1">
            <Clock size={12} />
            <span className="font-body text-[10px] uppercase tracking-wider">
              {article.readTime} min read
            </span>
          </div>
        </div>

        <h3 className={cn(
          "font-display leading-tight text-text group-hover:text-accent transition-colors",
          featured ? "text-3xl" : "text-xl md:text-2xl"
        )}>
          {article.title}
        </h3>

        <p className="font-body text-sm text-muted line-clamp-2 leading-relaxed">
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
};

export default ArticleCard;
