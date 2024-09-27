/* eslint-disable no-underscore-dangle */
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import db from '@/lib/db';

export const getPosts = async () => {
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
  });
  return posts;
};

export const metadata: Metadata = {
  title: '동네생활',
};

async function PostListPage() {
  const posts = await getPosts();
  return (
    <div className="p-5 flex flex-col">
      {(posts || []).map(post => (
        <Link
          key={post.id}
          href={`/posts/${post.id}`}
          className="border-b border-neutral-500 text-neutral-400 flex flex-col gap-2 last:border-b-0"
        >
          <h2 className="text-white text-lg font-semibold">{post.title}</h2>
          <p>{post.description}</p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-4 items-center">
              <span>{dayjs(post.created_at).format('YYYY.MM.DD')}</span>
              <span>·</span>
              <span>조회 {post.views}</span>
            </div>
            <div className="flex gap-4 items-center *:flex *:gap-1 *:items-center">
              <span>
                <HandThumbUpIcon className="size-4" />
                {post._count.likes}
              </span>
              <span>
                <ChatBubbleBottomCenterIcon className="size-4" />
                {post._count.comments}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default PostListPage;
