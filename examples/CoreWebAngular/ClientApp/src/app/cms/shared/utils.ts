import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'firstParagraph'})
export class FirstParagraphPipe implements PipeTransform {
  transform(value: string): string {
    if (value || value.length === 0)
      return "";
    let matches = value.match('<p[^>]*>.*?</p>');  
    return matches ? matches[0] : "";
  }
}
