/**
 * Utility functions for rating system
 */

export const ratingUtils = {
    /**
     * Get star count for rendering
     */
    getStarCount(rating: number): { filled: number; empty: number } {
        const filled = Math.round(rating);
        return {
            filled: Math.min(filled, 5),
            empty: Math.max(0, 5 - filled),
        };
    },

    /**
     * Format rating with appropriate precision
     */
    formatRating(rating: number | undefined): string {
        if (!rating) return 'N/A';
        return rating.toFixed(1);
    },

    /**
     * Get rating color based on value
     */
    getRatingColor(rating: number | undefined): string {
        if (!rating) return 'text-gray-500';
        if (rating >= 4.5) return 'text-green-600';
        if (rating >= 4) return 'text-blue-600';
        if (rating >= 3) return 'text-yellow-600';
        if (rating >= 2) return 'text-orange-600';
        return 'text-red-600';
    },

    /**
     * Get rating description
     */
    getRatingDescription(rating: number): string {
        const descriptions: Record<number, string> = {
            5: 'Excellent',
            4: 'Very Good',
            3: 'Good',
            2: 'Fair',
            1: 'Poor',
        };
        return descriptions[rating] || 'Not Rated';
    },

    /**
     * Get rating emoji
     */
    getRatingEmoji(rating: number): string {
        const emojis: Record<number, string> = {
            5: '😍',
            4: '😊',
            3: '😐',
            2: '😕',
            1: '😞',
        };
        return emojis[rating] || '😶';
    },

    /**
     * Render star display string
     */
    renderStars(rating: number): string {
        const filled = Math.round(rating);
        return '★'.repeat(filled) + '☆'.repeat(5 - filled);
    },

    /**
     * Get rating badge class
     */
    getRatingBadgeClass(rating: number | undefined): string {
        if (!rating) return 'bg-gray-100 text-gray-700';
        if (rating >= 4.5) return 'bg-green-100 text-green-700';
        if (rating >= 4) return 'bg-blue-100 text-blue-700';
        if (rating >= 3) return 'bg-yellow-100 text-yellow-700';
        if (rating >= 2) return 'bg-orange-100 text-orange-700';
        return 'bg-red-100 text-red-700';
    },

    /**
     * Calculate rating distribution
     */
    calculateDistribution(
        ratings: { rating: number }[]
    ): Record<number, { count: number; percentage: number }> {
        const total = ratings.length;
        const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

        ratings.forEach((r) => {
            distribution[r.rating]++;
        });

        return Object.fromEntries(
            Object.entries(distribution).map(([star, count]) => [
                star,
                {
                    count,
                    percentage: total > 0 ? (count / total) * 100 : 0,
                },
            ])
        );
    },

    /**
     * Get rating summary text
     */
    getSummaryText(averageRating: number | undefined, totalRatings: number): string {
        if (!averageRating || totalRatings === 0) return 'Not yet rated';
        if (totalRatings === 1) return `${averageRating.toFixed(1)}★ from 1 rating`;
        return `${averageRating.toFixed(1)}★ from ${totalRatings} ratings`;
    },

    /**
     * Determine if rating should be highlighted
     */
    isHighlyRated(rating: number | undefined): boolean {
        return (rating || 0) >= 4.5;
    },

    /**
     * Format rating change
     */
    formatRatingChange(oldRating: number, newRating: number): string {
        const change = newRating - oldRating;
        if (change > 0) return `+${change.toFixed(1)}`;
        return change.toFixed(1);
    },

    /**
     * Validate rating value
     */
    isValidRating(rating: any): boolean {
        return Number.isInteger(rating) && rating >= 1 && rating <= 5;
    },

    /**
     * Get rating percentile
     */
    getRatingPercentile(currentRating: number, allRatings: number[]): number {
        const betterCount = allRatings.filter((r) => r > currentRating).length;
        return Math.round(((allRatings.length - betterCount) / allRatings.length) * 100);
    },
};

/**
 * Rating Components - Reusable UI components
 */
export const RatingStars = ({
                                value,
                                size = 'md',
                                showValue = true,
                            }: {
    value: number;
    size?: 'sm' | 'md' | 'lg';
    showValue?: boolean;
}) => {
    const sizeMap = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-4xl',
    };

    return (
        <div className="flex items-center gap-2">
        <span className={sizeMap[size]}>{ratingUtils.renderStars(value)}</span>
    {showValue && <span className="font-bold">{ratingUtils.formatRating(value)}</span>}
        </div>
    );
    };

    /**
     * Display rating with color coding
     */
    export const RatingBadge = ({ rating }: { rating: number | undefined }) => {
        if (!rating) return <span className="text-gray-500">Not rated</span>;

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${ratingUtils.getRatingBadgeClass(rating)}`}>
        {ratingUtils.formatRating(rating)} {ratingUtils.getRatingEmoji(rating)}
        </span>
    );
    };

    /**
     * Display distribution bar
     */
    export const RatingDistribution = ({
                                           ratings,
                                       }: {
        ratings: { rating: number }[];
    }) => {
        const distribution = ratingUtils.calculateDistribution(ratings);

        return (
            <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
            const { count, percentage } = distribution[star];
            return (
                <div key={star} className="flex items-center gap-2">
            <span className="w-8 text-sm font-semibold">{star}★</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
                className="bg-yellow-400 h-2 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
            />
            </div>
            <span className="text-gray-600 text-sm w-8 text-right">{count}</span>
                </div>
        );
        })}
        </div>
    );
    };