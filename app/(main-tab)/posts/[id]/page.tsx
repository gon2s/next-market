/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from '@heroicons/react/24/outline';
import { UserIcon, EyeIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';
import dayjs from 'dayjs';
import { unstable_cache as nextCache, revalidateTag } from 'next/cache';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React from 'react';
import { disLikePostAction, likePostAction } from './server-action';
import db from '@/lib/db';
import getSession from '@/lib/getSession';

const getPostDetail = async (id: number) => {
  try {
    const data = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            profile_img: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
    return data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
};

const getCachedPostDetail = nextCache(getPostDetail, ['POST_DETAIL']);

const getLikeInfo = async (params: { postId: number; userId: number }) => {
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId: params.postId,
        userId: params.userId,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      postId: params.postId,
    },
  });
  return {
    likeCount,
    isLiked: !!isLiked,
  };
};

const getCachedLikeInfo = async (postId: number) => {
  const session = await getSession();
  const userId = session.id;

  const cache = nextCache(getLikeInfo, ['LIKE_INFO'], {
    tags: [`LIKE_INFO-${postId}`],
  });
  return cache({ postId, userId: userId! });
};

interface PostDetailPageProps {
  params: {
    id: string;
  };
}

async function PostDetailPage({ params }: PostDetailPageProps) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const data = await getCachedPostDetail(id);

  if (!data) return notFound();

  const handleLikePost = async () => {
    'use server';

    try {
      await likePostAction({ postId: id });
      revalidateTag(`LIKE_INFO-${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDislikePost = async () => {
    'use server';

    try {
      await disLikePostAction({ postId: id });
      revalidateTag('LIKE_INFO');
    } catch (error) {
      console.log(error);
    }
  };

  const likeInfo = await getCachedLikeInfo(id);

  return (
    <div className="p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        {data.user.profile_img ? (
          <Image
            width={28}
            height={28}
            className="size-7 rounded-full"
            src={data.user.profile_img}
            alt={data.user.username}
          />
        ) : (
          <UserIcon className="size-7 rounded-full" />
        )}
        <div>
          <span className="text-sm font-semibold">{data.user.username}</span>
          <div className="text-xs">
            <span>{dayjs(data.created_at).format('YYYY.MM.DD')}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{data.title}</h2>
      <p className="mb-5">{data.description}</p>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>조회 {data.views}</span>
        </div>
        <form action={likeInfo.isLiked ? handleDislikePost : handleLikePost}>
          <button
            className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2  transition-colors ${
              likeInfo.isLiked
                ? 'bg-orange-500 text-white border-orange-500'
                : 'hover:bg-neutral-800'
            }`}
            type={'submit'}
          >
            {likeInfo.isLiked ? (
              <HandThumbUpIcon className="size-5" />
            ) : (
              <OutlineHandThumbUpIcon className="size-5" />
            )}
            {likeInfo.isLiked ? (
              <span>{likeInfo.likeCount}</span>
            ) : (
              <span>{`공감하기 (${likeInfo.likeCount})`}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostDetailPage;
