import { Pipe, PipeTransform } from '@angular/core';
import * as anchorify from "anchorify";

@Pipe({
  name: 'multilineText',
})
export class MultilineTextPipe implements PipeTransform {
  transform(str: string) {
    let replaced = anchorify(str);
    replaced = replaced.replace(/(\r\n|\r|\n)/g, '<br/>');
    return replaced;
  }

}
