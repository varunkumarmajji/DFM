import { Component, inject, ViewChild, OnDestroy, viewChild, ElementRef } from '@angular/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../layouts/navbar/navbar.component";
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import { NavigationEnd, Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { FleidsComponent } from '../../elements/fleids/fleids.component';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-build',
  standalone: true,
  imports: [MatTooltipModule,FleidsComponent,CdkDropListGroup,MatButtonToggleModule,MatIconModule, CdkDropList, CdkDrag, CommonModule, NavbarComponent,MatSidenavModule,MatListModule],
  templateUrl: './build.component.html',
  styleUrl: './build.component.css'
})
export class BuildComponent implements OnDestroy{

  @ViewChild('completeform') formContainer: ElementRef | undefined;



  events: string[] = [];
  opened: boolean = false;
  onSidenavToggle(): void {
    this.opened = !this.opened;
  }
  mobileQuery: MediaQueryList;
  fillerNav = [
    { label: 'Text Box' },
    { label: 'Input Box' },
    { label: 'Radio Button' },
    { label: 'Check Box' },
    { label: 'Email' },
    { label: 'Phone Number' },
    { label: 'Dropdown' },
  ];

  private _mobileQueryListener: () => void;

  constructor(private router: Router) {
    const changeDetectorRef = inject(ChangeDetectorRef);
    const media = inject(MediaMatcher);

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  mainContentItems: any[] = [
    { label: 'Drag Here or Click from the Sidenav to add Elements' },
  ];

  // Drop event handler to move a single item to the main content area
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer !== event.container) {
      // Get the dragged item from the previous container
      const draggedItem = event.previousContainer.data[event.previousIndex];
  
      // Insert the dragged item at the dragged index in the main content items array
      const draggedIndex = event.currentIndex;
      this.mainContentItems.splice(draggedIndex, 0, { ...draggedItem }); // Insert the item at the dragged index
  
      // Optionally, remove the default first item if it is a placeholder
      const index = this.mainContentItems.findIndex(item => item.label === 'Drag Here or Click from the Sidenav to add Elements');
    if (index !== -1) {
      this.mainContentItems.splice(index, 1); // Removes the item if found
    }
    } else {
      // If it's the same container, reorder items
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  onItemClick(navItem: any) {
   
    if (this.mainContentItems && this.mainContentItems.length > 0) {
      // Now it's safe to access mainContentItems[0]
      if (
        this.mainContentItems[0].label ===
        'Drag Here or Click from the Sidenav to add Elements'
      ) {
        this.mainContentItems.splice(0, 1); // Removes the first item in the array
      }
      // Add the clicked item to mainContentItems
      this.mainContentItems.push({ ...navItem });
    } else {
      // Handle the case where mainContentItems is empty or undefined
      console.log('mainContentItems is empty or not defined');
      
    }
  }
  
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  onEdit(item: any) {
    console.log('Edit clicked for item:', item);
    // Implement edit logic
  }

  onDelete(item: any) {
    console.log('Delete clicked for item:', item);
    // Remove the item from the array
    this.mainContentItems = this.mainContentItems.filter(i => i !== item);
    if(this.mainContentItems.length < 1)
    {
      this.mainContentItems.push({ label: 'Drag Here or Click from the Sidenav to add Elements' });
    }
  }
  
  onDuplicate(item: any) {
    console.log('Duplicate clicked for item:', item);
    // Duplicate the item and add it to the array
    const duplicatedItem = { ...item };
    this.mainContentItems.push(duplicatedItem);
  }

  getPlainHTML(): string {
    if (this.formContainer) {
      const htmlContent = this.formContainer.nativeElement.innerHTML;
      
      // Extract content inside <app-fleids> tags only
      const appFleidsContent = [];
      
      // Use a regular expression to match only the <app-fleids> child content (excluding parent divs and buttons)
      const regex = /<app-fleids[^>]*>(.*?)<\/app-fleids>/g;
      let match;
      
      while ((match = regex.exec(htmlContent)) !== null) {
        appFleidsContent.push(match[1].trim());  // Store only the inner content of <app-fleids>
      }

      // Combine all the content into a single string (if necessary)
      const cleanedContent = appFleidsContent.join(' ');

      console.log(cleanedContent);  // Log the extracted content

      return cleanedContent;  // Return the extracted content
    }
    return '';
  }

  // Method to download the plain HTML content
  downloadForm(downloadType: string): void {
    console.log(this.mainContentItems);
    const plainHtml = this.getPlainHTML();

    // Create a Blob from the HTML content
    const blob = new Blob([plainHtml], { type: 'text/html' });

    // Create a link to trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'form.html';  // File name for download

    // Trigger the download
    link.click();
  }
}



