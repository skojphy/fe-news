import React, { useState, useEffect, useCallback } from 'react';
import { Article, Comment, DevEvent, FunContent } from './types';
import { INITIAL_ARTICLES } from './services/mockData';
import { generateArticle, generateDevEvents, generateFunContents } from './services/geminiService';

// --- Icons ---
const Icons = {
  Home: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Pen: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Heart: ({ filled }: { filled: boolean }) => <svg className={`w-5 h-5 ${filled ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  Message: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  Bookmark: ({ filled }: { filled: boolean }) => <svg className={`w-5 h-5 ${filled ? 'fill-green-600 text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>,
  Sparkles: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 3.214L13 21l-2.286-6.857L5 12l5.714-3.214z" /></svg>,
  Calendar: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  X: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Loader: () => <svg className="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>,
  Smile: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
};

// --- Components ---

const MarkdownRenderer = ({ content }: { content: string }) => {
  // Simple specific markdown rendering for this demo
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-8 mb-4 text-gray-800 font-heading">{line.replace('## ', '')}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold mt-6 mb-3 text-gray-800 font-heading">{line.replace('### ', '')}</h3>;
      if (line.startsWith('* ')) return <li key={i} className="ml-5 list-disc text-gray-700 my-1.5">{line.replace('* ', '')}</li>;
      if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-green-500 pl-4 italic text-gray-600 my-6 py-1 bg-gray-50 rounded-r">{line.replace('> ', '')}</blockquote>;
      if (line.startsWith('1. ')) return <li key={i} className="ml-5 list-decimal text-gray-700 my-1.5">{line.replace(/^[0-9]+\. /, '')}</li>;
      if (line.startsWith('```')) return null; // Skip code block markers for simple render
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="mb-5 leading-loose text-gray-700">{line}</p>;
    });
  };

  return <div className="article-content">{renderContent(content)}</div>;
};

const Navbar = ({ onViewChange, currentView }: { onViewChange: (view: string) => void, currentView: string }) => (
  <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm transition-all">
    <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-8">
        <div 
          onClick={() => onViewChange('home')} 
          className="cursor-pointer flex items-center space-x-2 group"
        >
          <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-green-200 shadow-lg transform group-hover:rotate-3 transition-transform">G</div>
          <span className="text-xl font-black tracking-tight text-gray-900 font-heading group-hover:text-green-600 transition-colors">Gmarket<span className="font-light text-gray-400 mx-1">|</span>FE-News</span>
        </div>
        <div className="hidden md:flex items-center space-x-1 text-sm font-medium text-gray-500">
          <button onClick={() => onViewChange('home')} className={`px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-green-600 transition-all ${currentView === 'home' ? 'text-green-600 bg-green-50' : ''}`}>피드</button>
          <button onClick={() => onViewChange('about')} className={`px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-green-600 transition-all ${currentView === 'about' ? 'text-green-600 bg-green-50' : ''}`}>소개</button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => onViewChange('create')}
          className="flex items-center space-x-2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-green-600 hover:shadow-lg hover:shadow-green-200 transition-all transform hover:-translate-y-0.5"
        >
          <Icons.Pen />
          <span>글쓰기</span>
        </button>
      </div>
    </div>
  </nav>
);

const Sidebar = ({ funContents, events, loadingFun }: { funContents: FunContent[], events: DevEvent[], loadingFun: boolean }) => {
  return (
    <div className="space-y-6">
      {/* Dev Events Widget */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-2 mb-5 border-b border-gray-50 pb-3">
          <div className="bg-green-100 p-1.5 rounded-lg text-green-600">
            <Icons.Calendar />
          </div>
          <h3 className="font-bold text-gray-900 text-lg">다가오는 행사</h3>
        </div>
        {loadingFun ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-100 rounded w-3/4"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-5">
            {events.map((evt, i) => (
              <div key={i} className="flex flex-col group">
                <div className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">{evt.date}</div>
                <a href={evt.url} className="text-sm font-bold text-gray-800 hover:text-green-600 transition-colors leading-snug mb-0.5 group-hover:translate-x-1 transition-transform duration-300">{evt.name}</a>
                <div className="text-xs text-gray-400">{evt.location}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">일정이 없습니다.</p>
        )}
      </div>

      {/* Fun Contents Widget */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 shadow-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -mr-10 -mt-10"></div>
        
        <div className="flex items-center space-x-2 mb-5 relative z-10">
          <div className="text-yellow-300">
            <Icons.Smile />
          </div>
          <h3 className="font-bold text-lg">잠깐! 쉬어가세요</h3>
        </div>
        {loadingFun ? (
          <div className="animate-pulse space-y-4 opacity-50">
             <div className="h-4 bg-gray-600 rounded w-3/4"></div>
             <div className="h-4 bg-gray-600 rounded w-full"></div>
          </div>
        ) : funContents.length > 0 ? (
           <ul className="space-y-4 relative z-10">
             {funContents.map((item, i) => (
               <li key={i} className="border-l-2 border-green-500/30 pl-3 hover:border-green-500 transition-colors">
                 <a href={item.url} className="text-sm font-bold text-green-300 hover:text-green-200 block mb-1">
                   {item.title}
                 </a>
                 <p className="text-xs text-gray-300 leading-snug line-clamp-2">{item.description}</p>
               </li>
             ))}
           </ul>
        ) : (
          <p className="text-sm text-gray-500">로딩 중...</p>
        )}
      </div>
    </div>
  );
};

const ArticleCard = ({ article, onClick }: { article: Article; onClick: (id: string) => void }) => (
  <div 
    onClick={() => onClick(article.id)}
    className="group cursor-pointer flex flex-col md:flex-row gap-6 items-start bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-300"
  >
    <div className="flex-1 order-2 md:order-1">
      <div className="flex items-center space-x-2 mb-3">
        <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wide rounded-full">{article.tags[0]}</span>
        <span className="text-gray-300 text-xs">•</span>
        <span className="text-xs font-medium text-gray-500">{article.date}</span>
      </div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-heading mb-3 group-hover:text-green-600 transition-colors leading-tight">
        {article.title}
      </h2>
      <p className="text-gray-600 text-sm md:text-base line-clamp-2 mb-5 leading-relaxed">
        {article.content_markdown.replace(/[#*`]/g, '').slice(0, 120)}...
      </p>
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-gray-900">{article.author}</span>
        </div>
        <div className="flex items-center space-x-4 text-gray-400 text-sm">
           <span className="flex items-center space-x-1 group-hover:text-red-400 transition-colors">
             <Icons.Heart filled={false} /> <span className="font-medium">{article.likes}</span>
           </span>
           <span className="flex items-center space-x-1 group-hover:text-blue-400 transition-colors">
             <Icons.Message /> <span className="font-medium">{article.comments.length}</span>
           </span>
        </div>
      </div>
    </div>
    <div className="w-full md:w-48 h-48 md:h-36 flex-shrink-0 order-1 md:order-2 rounded-xl overflow-hidden bg-gray-100 relative">
      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10"></div>
      <img src={article.thumbnail_url} alt={article.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
    </div>
  </div>
);

const ArticleDetail = ({ 
  article, 
  onBack, 
  onToggleLike, 
  onToggleSave, 
  onAddComment 
}: { 
  article: Article, 
  onBack: () => void,
  onToggleLike: (id: string) => void,
  onToggleSave: (id: string) => void,
  onAddComment: (id: string, text: string) => void
}) => {
  const [commentText, setCommentText] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(article.id, commentText);
    setCommentText('');
  };

  return (
    <div className="animate-fade-in pb-20">
      <button onClick={onBack} className="text-gray-500 hover:text-green-600 mb-6 flex items-center space-x-2 text-sm font-bold transition-colors group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span>뒤로가기</span>
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
        <div className="flex items-center space-x-2 mb-6">
            {article.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                {tag}
              </span>
            ))}
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-gray-900 font-heading mb-8 leading-tight">
          {article.title}
        </h1>
        
        <div className="flex items-center justify-between border-b border-gray-100 pb-8 mb-10">
          <div className="flex items-center space-x-4">
             <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-green-100">
               {article.author[0]}
             </div>
             <div>
               <div className="text-base font-bold text-gray-900">{article.author}</div>
               <div className="text-xs text-gray-500">{article.date} • 5분 분량</div>
             </div>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => onToggleSave(article.id)} className="p-3 hover:bg-green-50 rounded-full transition-all group">
              <Icons.Bookmark filled={article.saved} />
            </button>
          </div>
        </div>

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-green-600">
          <img src={article.thumbnail_url} alt={article.title} className="w-full h-64 md:h-[500px] object-cover rounded-2xl mb-10 shadow-lg" />
          <MarkdownRenderer content={article.content_markdown} />
        </div>

        <div className="border-t border-gray-100 mt-16 pt-10">
          <div className="flex items-center space-x-8 mb-10">
             <button 
               onClick={() => onToggleLike(article.id)}
               className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors group"
             >
               <div className="p-2 bg-gray-50 rounded-full group-hover:bg-red-50 transition-colors">
                 <Icons.Heart filled={false} />
               </div>
               <span className="font-bold text-lg">{article.likes}</span>
             </button>
             <div className="flex items-center space-x-2 text-gray-600">
               <div className="p-2 bg-gray-50 rounded-full">
                <Icons.Message />
               </div>
               <span className="font-bold text-lg">{article.comments.length}</span>
             </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-6">댓글</h3>
          
          <form onSubmit={handleCommentSubmit} className="mb-12 relative">
             <textarea
               className="w-full p-5 pr-32 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white outline-none resize-none text-sm transition-all"
               rows={3}
               placeholder="이 글에 대한 생각을 남겨주세요..."
               value={commentText}
               onChange={(e) => setCommentText(e.target.value)}
             />
             <div className="absolute bottom-3 right-3">
               <button type="submit" className="bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-green-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled={!commentText.trim()}>
                 등록
               </button>
             </div>
          </form>

          <div className="space-y-8">
            {article.comments.length === 0 ? (
               <div className="text-center py-10 text-gray-400">첫 번째 댓글을 남겨보세요!</div>
            ) : (
              article.comments.map(comment => (
                <div key={comment.id} className="flex space-x-4 animate-fade-in">
                   <div className="w-10 h-10 bg-gray-100 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-gray-500 border border-gray-200">
                     {comment.author[0]}
                   </div>
                   <div className="flex-1 bg-gray-50 p-4 rounded-2xl rounded-tl-none">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-900">{comment.author}</span>
                        <span className="text-xs text-gray-400">{comment.date}</span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{comment.text}</p>
                   </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateArticle = ({ onSave, onCancel }: { onSave: (article: Omit<Article, 'id' | 'likes' | 'comments' | 'saved'>) => void, onCancel: () => void }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    author: '익명의 개발자'
  });

  const handleAiGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const result = await generateArticle(topic);
      setFormData(prev => ({
        ...prev,
        title: result.title,
        content: result.content_markdown,
        tags: result.tags.join(', ')
      }));
    } catch (error) {
      console.error("Failed to generate", error);
      alert("콘텐츠 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.content) return;
    onSave({
      title: formData.title,
      author: formData.author,
      date: new Date().toISOString().split('T')[0],
      tags: formData.tags.split(',').map(t => t.trim()),
      thumbnail_url: `https://picsum.photos/800/400?random=${Math.random()}`,
      content_markdown: formData.content
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-gray-900 font-heading">새 글 작성</h2>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
          <Icons.X />
        </button>
      </div>
      
      {/* AI Assistant Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100 mb-10 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -mr-10 -mt-10 pointer-events-none"></div>
         
         <div className="flex items-center space-x-2 mb-4 text-green-700 relative z-10">
            <Icons.Sparkles />
            <span className="font-bold text-sm uppercase tracking-wide">AI 어시스턴트</span>
         </div>
         <p className="text-sm text-gray-600 mb-6 relative z-10">주제를 입력하면 Gemini가 초안을 작성해드립니다.</p>
         <div className="flex gap-3 relative z-10">
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="예: 2024년 프론트엔드 트렌드 분석"
              className="flex-1 border border-white bg-white/80 backdrop-blur rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none shadow-sm"
            />
            <button 
              onClick={handleAiGenerate}
              disabled={loading || !topic}
              className="bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg shadow-green-200 transition-all"
            >
              {loading ? <div className="flex items-center space-x-2"><Icons.Loader /> <span>생성 중...</span></div> : '초안 생성'}
            </button>
         </div>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">제목</label>
          <input 
            type="text" 
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            placeholder="매력적인 제목을 입력하세요"
            className="w-full border-2 border-gray-100 bg-gray-50 focus:bg-white rounded-xl px-5 py-3 focus:border-green-500 outline-none transition-all font-bold text-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">태그 (쉼표로 구분)</label>
          <input 
            type="text" 
            value={formData.tags}
            onChange={e => setFormData({...formData, tags: e.target.value})}
            placeholder="React, CSS, Tip"
            className="w-full border-2 border-gray-100 bg-gray-50 focus:bg-white rounded-xl px-5 py-3 focus:border-green-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">내용 (Markdown)</label>
          <textarea 
            value={formData.content}
            onChange={e => setFormData({...formData, content: e.target.value})}
            rows={15}
            placeholder="자유롭게 내용을 작성하세요..."
            className="w-full border-2 border-gray-100 bg-gray-50 focus:bg-white rounded-xl px-5 py-4 focus:border-green-500 outline-none font-mono text-sm leading-relaxed transition-all"
          ></textarea>
        </div>
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
          <button onClick={onCancel} className="px-8 py-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-colors">취소</button>
          <button onClick={handleSubmit} className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-green-600 hover:shadow-lg hover:shadow-green-200 transition-all transform hover:-translate-y-1">발행하기</button>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [view, setView] = useState('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  
  // Widget Data
  const [funContents, setFunContents] = useState<FunContent[]>([]);
  const [events, setEvents] = useState<DevEvent[]>([]);
  const [widgetsLoading, setWidgetsLoading] = useState(false);

  // Fetch Sidebar Data via AI on mount
  useEffect(() => {
    const loadWidgets = async () => {
      setWidgetsLoading(true);
      try {
        const [funData, eventsData] = await Promise.all([
          generateFunContents(),
          generateDevEvents()
        ]);
        setFunContents(funData.contents);
        setEvents(eventsData.events);
      } catch (e) {
        console.error("Widget load fail", e);
      } finally {
        setWidgetsLoading(false);
      }
    };
    loadWidgets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleArticleClick = (id: string) => {
    setSelectedArticleId(id);
    setView('article');
    window.scrollTo(0, 0);
  };

  const handleCreateArticle = (newArticleData: Omit<Article, 'id' | 'likes' | 'comments' | 'saved'>) => {
    const newArticle: Article = {
      ...newArticleData,
      id: Date.now().toString(),
      likes: 0,
      comments: [],
      saved: false
    };
    setArticles([newArticle, ...articles]);
    setView('home');
  };

  const handleLike = (id: string) => {
    setArticles(articles.map(a => a.id === id ? { ...a, likes: a.likes + 1 } : a));
  };

  const handleSave = (id: string) => {
    setArticles(articles.map(a => a.id === id ? { ...a, saved: !a.saved } : a));
  };

  const handleComment = (id: string, text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: "나",
      text,
      date: new Date().toISOString().split('T')[0]
    };
    setArticles(articles.map(a => a.id === id ? { ...a, comments: [...a.comments, newComment] } : a));
  };

  // View Rendering Logic
  let mainContent;

  if (view === 'create') {
    mainContent = <CreateArticle onSave={handleCreateArticle} onCancel={() => setView('home')} />;
  } else if (view === 'article' && selectedArticleId) {
    const article = articles.find(a => a.id === selectedArticleId);
    if (article) {
      mainContent = (
        <ArticleDetail 
          article={article} 
          onBack={() => setView('home')}
          onToggleLike={handleLike}
          onToggleSave={handleSave}
          onAddComment={handleComment}
        />
      );
    }
  } else if (view === 'about') {
    mainContent = (
      <div className="bg-white p-12 rounded-3xl border border-gray-100 max-w-3xl mx-auto text-center shadow-xl shadow-gray-200/50">
        <div className="w-20 h-20 bg-green-500 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-black mb-8 shadow-lg shadow-green-200 transform rotate-3">G</div>
        <h1 className="text-4xl font-black text-gray-900 mb-6 font-heading">About Gmarket FE-News</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-10">
          Gmarket FE-News는 React와 Generative AI 기술을 결합하여 만든 뉴스 플랫폼 데모입니다.<br/>
          우리의 목표는 개발자들에게 AI가 큐레이션한 최신 정보를 빠르고 정확하게 전달하는 것입니다.
        </p>
        <div className="flex justify-center space-x-4">
          <button onClick={() => setView('home')} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 hover:shadow-lg hover:shadow-green-200 transition-all">피드로 돌아가기</button>
        </div>
      </div>
    );
  } else {
    // Home / Feed
    mainContent = (
      <div className="space-y-6">
        {articles.map(article => (
          <ArticleCard 
            key={article.id} 
            article={article} 
            onClick={handleArticleClick} 
          />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FA] pb-20 font-sans">
      <Navbar onViewChange={setView} currentView={view} />
      
      <div className="max-w-6xl mx-auto px-4 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Column */}
          <div className="lg:col-span-8">
            {mainContent}
          </div>

          {/* Sidebar Column (Only show on Home or Article view, hidden on Create) */}
          {view !== 'create' && (
            <div className="lg:col-span-4 space-y-8">
              <Sidebar 
                funContents={funContents} 
                events={events} 
                loadingFun={widgetsLoading} 
              />
              
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">뉴스레터 구독</h3>
                <p className="text-sm text-gray-500 mb-5">최신 프론트엔드 동향을 매주 메일로 받아보세요.</p>
                <input type="email" placeholder="이메일 주소 입력" className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-green-500 rounded-xl px-4 py-3 text-sm mb-3 outline-none transition-colors" />
                <button className="w-full bg-gray-900 text-white rounded-xl py-3 text-sm font-bold hover:bg-green-600 transition-colors shadow-lg shadow-gray-200">구독하기</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;