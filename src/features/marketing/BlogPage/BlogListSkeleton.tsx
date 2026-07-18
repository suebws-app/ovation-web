import { BlogListHeader } from "./BlogListHeader";
import { BlogSkeletonCard } from "./BlogSkeletonCard";

const SKELETON_CARDS = Array.from({ length: 6 }, (_, index) => index);

export const BlogListSkeleton = () => (
  <>
    <BlogListHeader />
    <section>
      <div className="section-container-small">
        <ul className="tablet:grid-cols-2 grid gap-8">
          {SKELETON_CARDS.map((index) => (
            <li key={index}>
              <BlogSkeletonCard />
            </li>
          ))}
        </ul>
      </div>
    </section>
  </>
);
