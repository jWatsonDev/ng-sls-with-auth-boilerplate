import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  noteId: any;
  noteForm: UntypedFormGroup;
  myForm: UntypedFormGroup;
  disableSubmit: boolean;
  note: any;
  notes: any = [];
  defaultTitle = 'fred';
  title;
  lastEvaluatedKeyTimestamp: number = 0;
  notesMessage: string = 'Get All Notes';
  allNotesLoaded: boolean = false;

  constructor(private _dataService: DataService,
    private _formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.defaultTitle = 'Title';
    this.noteForm = this._formBuilder.group({
      title: '',
      content: '',
      cat: '',
      timestamp: '',
      note_id: ''
    });
  }

  getNote() {
    this._dataService.getNote(this.noteId).subscribe(
      res => {
        this.noteForm.patchValue(res);
      }, (err) => {
        console.log(err);
      }
    );
  }

  deleteNote() {
    const noteTimestamp = this.noteForm.get('timestamp').value;
    this._dataService.deleteNote(noteTimestamp).subscribe(
      res => {
        this.noteForm.reset();
        this.noteId = null;
      }, (err) => {
        console.log(err);
      }
    );
  }

  getAllNotes() {
    if (!this.allNotesLoaded) {
      this._dataService.getNotes(this.lastEvaluatedKeyTimestamp).subscribe(
        res => {
          if (res.LastEvaluatedKey?.timestamp > 0) {
            this.lastEvaluatedKeyTimestamp = res.LastEvaluatedKey?.timestamp ? res.LastEvaluatedKey?.timestamp : 0;
            this.notesMessage = 'Load More';
          } else {
            this.notesMessage = 'All Notes Loaded';
            this.allNotesLoaded = true;
          }
          this.notes = [].concat(this.notes, res.Items);
        }, (err) => {
          console.log(err);
        }
      );
    }
  }

  resetNotes() {
    this.notes = [];
    this.lastEvaluatedKeyTimestamp = 0;
    this.notesMessage = 'Get All Notes';
    this.allNotesLoaded = false;
  }

  clearForm() {
    this.noteForm.reset();
  }

  onSubmit() {
    // CREATE
    if (!this.noteForm.value.timestamp) {
      this._dataService.addNote(this.noteForm.value).subscribe(
        note => {
          console.log('note created', note);
        },
        err => {
          console.error(err);
        }
      );
    } else {
      // UPDATE
      this._dataService.updateNote(this.noteForm.value).subscribe(
        note => {
          console.log('note updated', note)
        },
        err => {
          console.error(err);
        }
      );
    }
  }
}
