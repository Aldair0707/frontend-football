import { Component, Input } from '@angular/core';
import { ReactionService } from '../../services/reaction.service';

@Component({
  selector: 'app-reaction-buttons',
  templateUrl: './reaction-buttons.component.html',
  styleUrls: ['./reaction-buttons.component.css']
})
export class ReactionButtonsComponent {
  @Input() tweetId!: number;
  @Input() counts: { [reaction: string]: number } = {};

  constructor(private reactionService: ReactionService) {}

  react(reactionId: number) {
    this.reactionService.reactToTweet(this.tweetId, reactionId).subscribe();
    this.refreshCounts();
  }

  reactByName(reaction: string) {
    const id = this.getReactionId(reaction);
    this.react(id);
  }

  removeReaction() {
    this.reactionService.removeReaction(this.tweetId).subscribe();
    this.refreshCounts();
  }

  getEmoji(reaction: string): string {
    const map: any = {
      REACTION_LIKE: '👍',
      REACTION_LOVE: '❤️',
      REACTION_HAHA: '😂',
      REACTION_SAD: '😢',
      REACTION_GOAT: '🐐'
    };
    return map[reaction] || '❔';
  }

  getReactionId(reaction: string): number {
    const ids: any = {
      REACTION_LIKE: 1,
      REACTION_LOVE: 2,
      REACTION_HAHA: 3,
      REACTION_SAD: 4,
      REACTION_GOAT: 5
    };
    return ids[reaction];
  }

  getTooltip(reaction: string): string {
    const tips: any = {
      REACTION_LIKE: 'ME GUSTA',
      REACTION_LOVE: 'ME ENCANTA',
      REACTION_HAHA: 'ME EN RISA',
      REACTION_SAD: 'ME ENTRISTECE',
      REACTION_GOAT: 'THE GOAT'
    };
    return tips[reaction] || 'React';
  }

  getReactions(): string[] {
  return ['REACTION_LIKE', 'REACTION_LOVE', 'REACTION_HAHA', 'REACTION_SAD', 'REACTION_GOAT'];
}

refreshCounts() {
  this.reactionService.getReactionCount(this.tweetId).subscribe(data => {
    this.counts = data;
  });
}

}