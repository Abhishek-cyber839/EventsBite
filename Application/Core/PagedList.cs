using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Application.Core
{
    public class PagedList<T>:List<T>
    {
        public int currentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public PagedList(IEnumerable<T> items,int Count,int PageNumber,int pageSize){
            currentPage = PageNumber;
            TotalPages = (int)Math.Ceiling(Count / (double)pageSize);
            PageSize = pageSize;
            TotalCount = Count;
            AddRange(items); // As this class is inheriting from List<T> we need to add items to the List otherwise we'll get zero items.
        }

        public static async Task<PagedList<T>> CreateAsyncList(IQueryable<T> source,int pageNumber,int pageSize){
            // Count how many items are there before making any query to the database.
            var count = await source.CountAsync();
            /**
            Let's say there are total 12 items in database and we have set pageSize to 10
            then according to the logic below we will display 10 items on first page and 2 on second.
            For example 
            when pageNumber = 0 and pageSize = 10 ,source.Skip() will skip 0 items and then using Take(items_we_want) we grab 10 items
            when pageNumber = 1 and pageSize = 10 ,source.Skip() will skip 10 items and then Take(items_we_want)
            we get remaining 2 items on second page.
            */
            var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            return new PagedList<T>(items,count,pageNumber,pageSize); 
        }
    }
}