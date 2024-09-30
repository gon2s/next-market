'use client';

import { HandThumbUpIcon as OutlineHandThumbUpIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon } from '@heroicons/react/24/solid';
import { useOptimistic, useTransition } from 'react';
import { disLikePostAction, likePostAction } from './server-action';

interface PostLikeToggleButtonProps {
  postId: number;
  likeCount: number;
  isLiked: boolean;
}

function PostLikeToggleButton({
  postId,
  isLiked,
  likeCount,
}: PostLikeToggleButtonProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention
  const [_, startTransition] = useTransition();

  const [state, reducer] = useOptimistic(
    { isLiked, likeCount },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (prev, _payload) => {
      return {
        isLiked: !prev.isLiked,
        likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
      };
    },
  );

  const handleToggle = async () => {
    try {
      startTransition(() => {
        reducer(undefined);
      });
      if (!isLiked) {
        await likePostAction({ postId });
      } else {
        await disLikePostAction({ postId });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={handleToggle}
      className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2  transition-colors ${
        state.isLiked
          ? 'bg-orange-500 text-white border-orange-500'
          : 'hover:bg-neutral-800'
      }`}
      type={'button'}
    >
      {state.isLiked ? (
        <HandThumbUpIcon className="size-5" />
      ) : (
        <OutlineHandThumbUpIcon className="size-5" />
      )}
      {state.isLiked ? (
        <span>{state.likeCount}</span>
      ) : (
        <span>{`공감하기 (${state.likeCount})`}</span>
      )}
    </button>
  );
}

export default PostLikeToggleButton;
