import { Component } from '@angular/core';
import { take } from 'rxjs';
import { FeedItem } from 'src/app/models/feed-item';
import { SerializdCurrentlyWatchingItem } from 'src/app/models/serializd-currently-watching-item';
import { SerializdService } from './serializd.service';

@Component({
  selector: 'app-serializd-card',
  templateUrl: './serializd-card.component.html',
  styleUrls: ['./serializd-card.component.scss'],
})
export class SerializdCardComponent {
  public isLoading: boolean;
  public feedItems: FeedItem[];
  private numberOfShowsToDisplay = 5;

  constructor(private serializdService: SerializdService) {}

  ngOnInit() {
    this.isLoading = true;
    this.populateCurrentlyWatchingItems();
  }

  public async populateCurrentlyWatchingItems() {
    this.serializdService
      .getSerializdCurrentlyWatchingItems(this.numberOfShowsToDisplay)
      .pipe(take(1))
      .subscribe((result: SerializdCurrentlyWatchingItem[]) => {
        this.feedItems = result
          .map((m) => {
            return {
              title: m.bannerImage,
              date: m.dateAdded,
              imageUrl: m.bannerImage,
              url: m.showUrl,
            } as FeedItem;
          })
          .sort((s1, s2) => (s1.date < s2.date ? 1 : -1));
        this.isLoading = false;
      });
  }
}
