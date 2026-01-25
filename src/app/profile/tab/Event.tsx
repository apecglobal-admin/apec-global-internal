import React, { useEffect, useState } from 'react'
import { getListInternalEventEmployee } from '@/src/features/event/api/api';
import { useEventData } from '@/src/hooks/eventhook';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useDispatch } from 'react-redux';
import { Calendar, Clock, MapPin } from 'lucide-react';

function Event() {
  const dispatch = useDispatch();
  const { listInternalEventEmployee } = useEventData();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      dispatch(getListInternalEventEmployee({ page: currentPage, limit, token }) as any);
    }
  }, [dispatch, currentPage]);

  const events = listInternalEventEmployee?.data || [];
  const pagination = listInternalEventEmployee?.pagination || { total: 0, limit: 6, totalPages: 1 };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.totalPages;
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
              style={{ cursor: 'pointer' }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            isActive={currentPage === 1}
            onClick={() => handlePageChange(1)}
            style={{ cursor: 'pointer' }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        pages.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
              style={{ cursor: 'pointer' }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        pages.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
            style={{ cursor: 'pointer' }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sự kiện của tôi</h1>
      
      {events.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Không có sự kiện nào</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {events.map((item: any) => {
              const event = item.internal_events;
              return (
                <div
                  key={item.id}
                  className="bg-slate-800 border border-slate-700 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    {event.name}
                  </h3>
                  
                  <p className="text-white mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm text-white">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>
                        {new Date(event.start_date).toLocaleDateString('vi-VN')} - {new Date(event.end_date).toLocaleDateString('vi-VN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span>
                        {event.start_time.substring(0, 5)} - {event.end_time.substring(0, 5)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {item.checked !== null && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        item.checked ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.checked ? 'Đã xác nhận tham gia' : 'Chưa xác nhận tham gia'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {pagination.totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    style={{ 
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPage === 1 ? 0.5 : 1
                    }}
                  />
                </PaginationItem>

                {renderPageNumbers()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    style={{ 
                      cursor: currentPage === pagination.totalPages ? 'not-allowed' : 'pointer',
                      opacity: currentPage === pagination.totalPages ? 0.5 : 1
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}

export default Event;