"use client";
import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "~/components/ui/button";
import type { User } from "~/server/db/schema";
import { api } from '~/trpc/react';
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";

interface ReviewFormProps {
  bookId: string;
  user?: User;
  review?: {
    id: string;
    rating: number;
    title?: string | null;
    content: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StarSelector = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => {
  return (
    <div className="mb-2 flex items-center gap-1 text-2xl">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
          className={
            n <= value
              ? "text-yellow-400"
              : "text-muted-foreground transition-colors hover:text-yellow-400"
          }
          onClick={() => onChange(n)}
        >
          ★
        </button>
      ))}
      <span className="text-muted-foreground ml-2 text-base">
        {value ? `${value} / 5` : "No rating"}
      </span>
    </div>
  );
};

const ReviewForm: React.FunctionComponent<ReviewFormProps> = ({
  bookId,
  user,
  review,
  open,
  onOpenChange,
}) => {
  const [rating, setRating] = useState(review?.rating ?? 0);
  const [title, setTitle] = useState(review?.title ?? "");
  const [reviewText, setReviewText] = useState(review?.content ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const utils = api.useUtils();
  const createReviewMutation = api.book.createReview.useMutation({
    onSuccess: async () => {
      onOpenChange(false);
      cleanUp()
      await utils.book.getReviewsByBookId.invalidate({ id: bookId });
      await utils.book.getReviewsByBookId.refetch({ id: bookId });
    },
  });
  const updateReviewMutation = api.book.updateReview.useMutation({
    onSuccess: async () => {
      onOpenChange(false);
      cleanUp()
      await utils.book.getReviewsByBookId.invalidate({ id: bookId });
      await utils.book.getReviewsByBookId.refetch({ id: bookId });
    },
  });
  const deleteReviewMutation = api.book.deleteReview.useMutation({
    onSuccess: async () => {
      onOpenChange(false);
      cleanUp()
      await utils.book.getReviewsByBookId.invalidate({ id: bookId });
      await utils.book.getReviewsByBookId.refetch({ id: bookId });
    },
  });

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setTitle(review.title ?? "");
      setReviewText(review.content);
    }
  }, [review]);

  const cleanUp = () => {
    setRating(0)
    setTitle("")
    setReviewText("")
  }

  const handleDelete = async () => {
    if (!review?.id) return;
    
    try {
      await deleteReviewMutation.mutateAsync({
        reviewId: review.id,
      });
      console.log('Review deleted successfully!');
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  if (!user) {
    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 review-modal-overlay" />
          <Dialog.Content className="bg-background fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg p-8 shadow-lg focus:outline-none review-modal-content">
            <Dialog.Title className="mb-4 text-center text-xl font-semibold">
              Sign in to write a review
            </Dialog.Title>
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-muted-foreground">
                Please sign in or create an account to share your thoughts about this book.
              </p>
              <div className="flex gap-4">
                <Link href="/sign-in">
                  <Button variant="outline">Sign in</Button>
                </Link>
                <Link href="/sign-up">
                  <Button>Create account</Button>
                </Link>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground absolute top-4 right-4 text-xl"
                aria-label="Close"
              >
                ×
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (review?.id) {
        await updateReviewMutation.mutateAsync({
          reviewId: review.id,
          rating: rating,
          title: title,
          content: reviewText,
        });
        console.log('Review updated successfully!');
      } else {
        await createReviewMutation.mutateAsync({
          bookId: bookId,
          rating: rating,
          title: title,
          content: reviewText,
          userId: user.id,
        });
        console.log('Review created successfully!');
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 review-modal-overlay" />
        <Dialog.Content className="bg-background fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg p-8 shadow-lg focus:outline-none review-modal-content">
          <Dialog.Title className="mb-4 text-center text-xl font-semibold">
            {review?.id ? "Edit your review" : `Write Review`}
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <StarSelector value={rating} onChange={setRating} />
            <input
              type="text"
              placeholder="Review title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] placeholder:text-muted-foreground"
            />
            <textarea
              rows={5}
              placeholder="What do you think of the book?"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="resize-none w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] placeholder:text-muted-foreground"
              required
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={submitting || rating === 0}
                className="mt-2 flex-1"
              >
                {submitting ? (review?.id ? "Saving..." : "Posting...") : review?.id ? "Save changes" : "Post review"}
              </Button>
              {review?.id && (
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      className="mt-2"
                      disabled={submitting}
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your review.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </form>
          <Dialog.Close asChild>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground absolute top-4 right-4 text-xl"
              aria-label="Close"
            >
              ×
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ReviewForm;
