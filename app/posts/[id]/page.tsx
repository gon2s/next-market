/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-restricted-globals */
import { UserIcon, EyeIcon } from '@heroicons/react/24/solid';
import dayjs from 'dayjs';
import { unstable_cache as nextCache } from 'next/cache';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React from 'react';
import { PostCommentItem } from './components';
import { deletePostAction } from './server-action';
import { IComment } from '@/@types';
import { PostComment, PostLikeToggleButton } from '@/components';
import db from '@/lib/db';
import getSession from '@/lib/getSession';

const getIsOwner = async (userId: number) => {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return null;
};

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
            id: true,
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

const getCachedPostDetail = async (postId: number) => {
  const cache = nextCache(getPostDetail, [`POST_DETAIL_${postId}`], {
    tags: [`POST_DETAIL_${postId}`],
  });
  return cache(postId);
};

const getCommentList = async (params: { postId: number }) => {
  const res = await db.comment.findMany({
    where: {
      postId: params.postId,
    },
    select: {
      id: true,
      created_at: true,
      payload: true,
      user: {
        select: {
          id: true,
          profile_img: true,
          username: true,
        },
      },
    },
  });
  return res;
};

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
  if (isNaN(id)) return notFound();

  const data = await getCachedPostDetail(id);
  if (!data) return notFound();

  const isOwner = await getIsOwner(data.user.id);

  const commentList = (await getCommentList({
    postId: id,
  })) as unknown as IComment[];

  const likeInfo = await getCachedLikeInfo(id);

  const handleDeletePost = async () => {
    'use server';

    await deletePostAction({ postId: id });
  };

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
        <PostLikeToggleButton {...likeInfo} postId={id} />
      </div>

      <div className={'mt-4 flex flex-col gap-4'}>
        <PostComment postId={id} />
        {commentList.length > 0 && (
          <div className={'border-t-[0.5px] py-2 flex flex-col gap-4'}>
            {commentList.map(li => (
              <PostCommentItem data={li} postId={id} key={li.id} />
            ))}
          </div>
        )}
      </div>

      <div className="fixed left-0 bottom-0 w-full h-[80px] py-2 sm:px-5 px-2.4 bg-neutral-800 flex flex-row items-center gap-4 border-t-[0.5px] border-t-neutral-500">
        <div className="flex flex-1 flex-col gap-1 justify-center">
          <div className={'flex flex-row justify-between'}>
            {isOwner ? (
              <div
                className={
                  'flex flex-row items-center sm:gap-2 gap-1 *:sm:text-base text-sm'
                }
              >
                <form action={handleDeletePost}>
                  <button
                    className={
                      'bg-red-500 px-5 py-2 rounded-md text-white font-semibold'
                    }
                    type={'submit'}
                  >
                    삭제
                  </button>
                </form>
              </div>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetailPage;
