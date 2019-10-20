import { Component, OnInit, Renderer2 } from '@angular/core';
import { BgColors } from 'src/app/core/type/bg-color';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { DialogContentComponent } from '../dialog-content/dialog-content.component';

import { List, Card } from 'src/app/core/interface/list.interface';
import { CardService } from 'src/app/core/service/card.service';

@Component({
  selector: 'app-trello',
  templateUrl: './trello.component.html',
  styleUrls: ['./trello.component.css']
})
export class TrelloComponent implements OnInit {
  lists: List[] = [
    {
      id: 0,
      title: '노트',
      listSort: 0,
      cards: [
        {
          title: 0,
          id: 0,
          cardTitle: '담당자 인수 인계',
          description: 'todo1-1',
          comments: [
            {
              id: 0,
              comment: 'todo1-1',
              card: 0,
            }
          ],
          cardSort: 0,
        },
        {
          title: 1,
          id: 1,
          cardTitle: '가이드 라인',
          description: 'todo1-2',
          comments: [
            {
              id: 0,
              comment: 'todo1-2',
              card: 0,
            }
          ],
          cardSort: 1,
        },
      ],
    },
    {
      id: 1,
      title: 'To do',
      listSort: 1,
      cards: [
        {
          title: 0,
          id: 0,
          cardTitle: '코드 리뷰',
          description: 'todo2-1',
          comments: [
            {
              id: 0,
              comment: 'todo2',
              card: 0,
            }
          ],
          cardSort: 0,
        },
      ],
    },
    {
      id: 2,
      title: 'Doing',
      listSort: 2,
      cards: [
        {
          title: 0,
          id: 0,
          cardTitle: '카드 모달',
          description: 'todo2-1',
          comments: [
            {
              id: 0,
              comment: 'todo2',
              card: 0,
            }
          ],
          cardSort: 0,
        },
      ],
    },
    {
      id: 3,
      title: 'Done',
      listSort: 3,
      cards: [
        {
          title: 0,
          id: 0,
          cardTitle: '디자인 가이드 완성',
          description: 'todo2-1',
          comments: [
            {
              id: 0,
              comment: 'todo2',
              card: 0,
            }
          ],
          cardSort: 0,
        },
      ],
    },
  ];
  colorBoolean = false;
  colors: BgColors[] = ['#0079BF', '#D29034', '#4BBF6B', '#B03642'];
  addListOpen = false;
  addCardOpen = -1;
  verticalContainerHeight = 0;
  verticalBoxHeight = 0;

  constructor(
    private renderer: Renderer2,
    public cardService: CardService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getBgColor();
  }

  getBgColor(): void {
    this.renderer.setStyle(document.body, 'background-color', '#0079BF');
  }

  changeBgColor(color: BgColors): void {
    this.colorBoolean = !this.colorBoolean;
    this.renderer.setStyle(document.body, 'background-color', color);
  }

  generateListId(): number {
    return this.lists.length
      ? Math.max(...this.lists.map(({ id }) => id)) + 1
      : 0;
  }

  addList(input: HTMLInputElement): any {
    if (!input.value.trim()) { return; }
    this.lists = [...this.lists, {
      id: this.generateListId(),
      title: input.value.trim(),
      listSort: this.generateListSort(),
      cards: [],
    }];
    input.value = '';
  }

  generateListSort(): number {
    return this.lists.length
      ? Math.max(...this.lists.map(({ listSort }) => listSort)) + 1
      : 0;
  }

  getConnectedList(): any[] {
    return this.lists.map(x => `${x.id}`);
  }

  removeList(listId: number): any {
    this.lists = this.lists.filter(({ id }) => listId !== id);
    console.log(this.lists);
  }

  horizontalDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.lists, event.previousIndex, event.currentIndex);
    this.lists = this.lists.map((list, listSort) => ({ ...list, listSort }));
    console.log(this.lists);
  }

  generateCardId(cards: Card[]): number {
    return cards.length ? Math.max(...cards.map(({ id }) => id)) + 1 : 0;
  }

  generateCardSort(cards: Card[]): number {
    return cards.length ? Math.max(...cards.map(({ cardSort }) => cardSort)) + 1 : 0;
  }

  addCardTitle(cardInput: HTMLTextAreaElement): any {
    const value = cardInput.value.trim();
    if (!value) { return; }
    let newCardSort = 0;

    this.lists.forEach(list => {
      if (+cardInput.id === list.id) {
        newCardSort = list.cards.length ? Math.max(...list.cards.map(({ cardSort }) => cardSort)) + 1 : 0;
      }
    });

    this.lists = this.lists.map(list => {
      if (+cardInput.id === list.id) {
        return { ...list, cards: [...list.cards, {
          title: +cardInput.id,
          id: this.generateCardId(list.cards),
          cardTitle: value,
          description: '',
          comments: [],
          cardSort: this.generateCardSort(list.cards),
        }]};
      } else {
        return list;
      }
    });
  }

  removeCard(listId: number, removeCardId: number): any {
    this.lists = this.lists.map(list => {
      if (listId === list.id) {
        const newCard = list.cards.filter(({ id }) => removeCardId !== id);
        return { ...list, cards: [...newCard] };
      } else {
        return list;
      }
    });
  }

  verticalDrop(event: CdkDragDrop<string[]>): any {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.lists = this.lists.map(list => {
        if (+event.container.id === list.id) {
          const cards = list.cards.map((card, cardSort) => ({ ...card, cardSort }));
          return { ...list, cards };
        } else {
          return list;
        }
      });
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.lists = this.lists.map(list => {
        if (+event.previousContainer.id === list.id) {
          const cards = list.cards.map((card, cardSort) => ({ ...card, cardSort }));
          return { ...list, cards };
        } else if (+event.container.id === list.id) {
          const cards = list.cards.map((card, cardSort) => ({ ...card, cardSort }));
          return { ...list, cards };
        } else {
          return list;
        }
      });
    }
  }

  removeSnackBar(listId: number, removeCardId: number, card = false): any {
    const snackBarRef = this.snackBar.open(
      'Are you sure you want to delete?',
      'Delete',
      {
        duration: 5000,
        verticalPosition: 'top'
      }
    );
    snackBarRef.onAction().subscribe(() => {
      if (card) {
        this.removeCard(listId, removeCardId);
      } else {
        this.removeList(listId);
      }
    });
  }

  titleResize(textarea: HTMLTextAreaElement): any {
    textarea.style.height = '1px';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  changeTitle(
    verticalListHeaderTarget: HTMLDivElement,
    textarea: HTMLTextAreaElement
  ): any {
    verticalListHeaderTarget.classList.add('is-hidden');
    textarea.focus();
  }


  changeTitleEnd(elem: HTMLTextAreaElement, block: HTMLDivElement): any {
    const title = elem.value.trim();
    if (!title) { return; }
    block.classList.remove('is-hidden');
    this.lists = this.lists.map(list => list.id === +elem.id ? { ...list, title } : list);
  }

  verticalPlaceholderHeight(elem: HTMLDivElement): void {
    this.verticalContainerHeight = elem.scrollHeight;
  }

  boxPlaceholderHeight(elem: HTMLDivElement): void {
    this.verticalBoxHeight = elem.scrollHeight;
  }

  openDialog(card: Card): void {
    this.cardService.card = card;

    const dialogRef = this.dialog.open(DialogContentComponent, {
      height: '800px',
      width: '570px',
      data: { card }
    });
  }
}
