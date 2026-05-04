import { ChevronRight, Users, MapPin, Heart, GraduationCap, Baby } from 'lucide-react';
import type { Visitor } from '../../lib/types';

const tagIcons: Record<string, React.ReactNode> = {
  first_time_guest: <Heart className="w-3.5 h-3.5" />,
  returning_guest: <Heart className="w-3.5 h-3.5" />,
  recently_moved: <MapPin className="w-3.5 h-3.5" />,
  college_student: <GraduationCap className="w-3.5 h-3.5" />,
  single_parent: <Users className="w-3.5 h-3.5" />,
  brought_kids: <Baby className="w-3.5 h-3.5" />,
  has_family: <Users className="w-3.5 h-3.5" />,
  connected_with_pastor: <Heart className="w-3.5 h-3.5" />,
  evening_service: <Heart className="w-3.5 h-3.5" />,
};

const tagLabels: Record<string, string> = {
  first_time_guest: 'First-time guest',
  returning_guest: 'Returning guest',
  recently_moved: 'Recently moved to town',
  college_student: 'College student',
  single_parent: 'Single parent',
  brought_kids: 'Came with her kids',
  has_family: 'Came with family',
  connected_with_pastor: 'Met with pastor',
  evening_service: 'Evening service attendee',
};

interface WhatWeKnowProps {
  visitor: Visitor;
}

export function WhatWeKnow({ visitor }: WhatWeKnowProps) {
  return (
    <div className="bg-white/60 border border-stone-100 rounded-2xl overflow-hidden">
      <button className="w-full flex items-center justify-between px-5 py-4">
        <h3 className="text-sm font-medium text-stone-700">What we know about {visitor.first_name}</h3>
        <ChevronRight className="w-4 h-4 text-stone-300" />
      </button>
      <div className="border-t border-stone-50 px-5 pb-5 pt-3 space-y-2">
        {visitor.segmentation_tags.map((tag) => (
          <div key={tag} className="flex items-center gap-2 text-sm text-stone-600">
            <span className="text-amber-600">{tagIcons[tag]}</span>
            <span>{tagLabels[tag] ?? tag.replace(/_/g, ' ')}</span>
          </div>
        ))}
        {visitor.notes && (
          <p className="text-xs text-stone-400 mt-2 italic">{visitor.notes}</p>
        )}
      </div>
    </div>
  );
}
