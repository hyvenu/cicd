import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchCategory'
})
export class SearchCategoryPipe implements PipeTransform {

  transform(items: Array<any>, category_name: string): Array<any> {
    return items.filter(item => item.category_name === category_name);
  }

}
